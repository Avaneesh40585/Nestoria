-- =============================================================
-- Nestoria — Rating recomputation triggers
-- Bayesian-smoothed average + sentiment composite (0-100 score).
-- =============================================================

-- -------------------------------------------------------------
-- Hotel rating recompute
-- -------------------------------------------------------------
CREATE OR REPLACE FUNCTION recompute_hotel_rating(p_hotel_id INTEGER) RETURNS void AS $$
DECLARE
    v_count          INTEGER;
    v_avg_rating     NUMERIC;
    v_avg_sentiment  NUMERIC;
    v_bayes          NUMERIC;
    v_score          INTEGER;
    -- tuning
    confidence_n     CONSTANT INTEGER := 50;
    global_avg       CONSTANT NUMERIC := 3.8;
    w_rating         CONSTANT NUMERIC := 0.7;
    w_sentiment      CONSTANT NUMERIC := 0.3;
BEGIN
    SELECT COUNT(*), AVG(rating)
      INTO v_count, v_avg_rating
      FROM hotel_reviews
     WHERE hotel_id = p_hotel_id;

    SELECT AVG(sentiment_score) / 100.0
      INTO v_avg_sentiment
      FROM (
        SELECT sentiment_score
          FROM hotel_reviews
         WHERE hotel_id = p_hotel_id
           AND sentiment_score IS NOT NULL
         ORDER BY created_at DESC
         LIMIT 100
      ) recent;

    IF v_count = 0 THEN
        v_avg_rating := 0;
        v_score      := 0;
    ELSE
        v_bayes := ((v_count * v_avg_rating) + (confidence_n * global_avg))
                   / (v_count + confidence_n);
        v_score := ROUND(((w_rating * ((v_bayes - 1) / 4.0))
                        + (w_sentiment * COALESCE(v_avg_sentiment, 0))) * 100);
    END IF;

    UPDATE hotels
       SET rating_avg   = ROUND(COALESCE(v_avg_rating, 0)::NUMERIC, 1),
           rating_count = v_count,
           score        = v_score
     WHERE id = p_hotel_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION trg_hotel_review_changed() RETURNS trigger AS $$
BEGIN
    PERFORM recompute_hotel_rating(COALESCE(NEW.hotel_id, OLD.hotel_id));
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_hotel_reviews_aiud
AFTER INSERT OR UPDATE OR DELETE ON hotel_reviews
FOR EACH ROW EXECUTE FUNCTION trg_hotel_review_changed();

-- -------------------------------------------------------------
-- Room rating recompute
-- -------------------------------------------------------------
CREATE OR REPLACE FUNCTION recompute_room_rating(p_room_id INTEGER) RETURNS void AS $$
DECLARE
    v_count          INTEGER;
    v_avg_rating     NUMERIC;
    v_avg_sentiment  NUMERIC;
    v_bayes          NUMERIC;
    v_score          INTEGER;
    confidence_n     CONSTANT INTEGER := 30;
    global_avg       CONSTANT NUMERIC := 3.8;
    w_rating         CONSTANT NUMERIC := 0.7;
    w_sentiment      CONSTANT NUMERIC := 0.3;
BEGIN
    SELECT COUNT(*), AVG(rating)
      INTO v_count, v_avg_rating
      FROM room_reviews
     WHERE room_id = p_room_id;

    SELECT AVG(sentiment_score) / 100.0
      INTO v_avg_sentiment
      FROM (
        SELECT sentiment_score
          FROM room_reviews
         WHERE room_id = p_room_id
           AND sentiment_score IS NOT NULL
         ORDER BY created_at DESC
         LIMIT 50
      ) recent;

    IF v_count = 0 THEN
        v_avg_rating := 0;
        v_score      := 0;
    ELSE
        v_bayes := ((v_count * v_avg_rating) + (confidence_n * global_avg))
                   / (v_count + confidence_n);
        v_score := ROUND(((w_rating * ((v_bayes - 1) / 4.0))
                        + (w_sentiment * COALESCE(v_avg_sentiment, 0))) * 100);
    END IF;

    UPDATE rooms
       SET rating_avg   = ROUND(COALESCE(v_avg_rating, 0)::NUMERIC, 1),
           rating_count = v_count,
           score        = v_score
     WHERE id = p_room_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION trg_room_review_changed() RETURNS trigger AS $$
BEGIN
    PERFORM recompute_room_rating(COALESCE(NEW.room_id, OLD.room_id));
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_room_reviews_aiud
AFTER INSERT OR UPDATE OR DELETE ON room_reviews
FOR EACH ROW EXECUTE FUNCTION trg_room_review_changed();

-- -------------------------------------------------------------
-- price_from denormalisation — keep hotels.price_from in sync
-- -------------------------------------------------------------
CREATE OR REPLACE FUNCTION recompute_hotel_price_from(p_hotel_id INTEGER) RETURNS void AS $$
BEGIN
    UPDATE hotels h
       SET price_from = sub.min_price
      FROM (SELECT COALESCE(MIN(price_per_night), 0) AS min_price
              FROM rooms WHERE hotel_id = p_hotel_id) sub
     WHERE h.id = p_hotel_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION trg_room_price_changed() RETURNS trigger AS $$
BEGIN
    PERFORM recompute_hotel_price_from(COALESCE(NEW.hotel_id, OLD.hotel_id));
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_rooms_price_aiud
AFTER INSERT OR UPDATE OF price_per_night OR DELETE ON rooms
FOR EACH ROW EXECUTE FUNCTION trg_room_price_changed();
