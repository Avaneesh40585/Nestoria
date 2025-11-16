-- =============================================
-- HOTEL REVIEW TRIGGERS
-- =============================================

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS trg_after_customer_hotel_review_changes ON Customer_Hotel_Review;

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS fn_update_hotel_overall_scores();

-- Create the trigger function with proper naming
CREATE OR REPLACE FUNCTION fn_update_hotel_overall_scores()
RETURNS TRIGGER AS $$
DECLARE
    hotel_id_to_update VARCHAR(12);
    avg_hotel_rating NUMERIC;
    total_review_count INT;
    avg_hotel_sentiment NUMERIC;
    
    -- === TUNING PARAMETERS ===
    min_confidence_threshold INT := 50;
    global_avg_rating NUMERIC := 3.8;
    weight_rating NUMERIC := 0.7;
    weight_sentiment NUMERIC := 0.3;
    -- ===========================
    
    bayesian_rating_score NUMERIC;
    normalized_rating_score NUMERIC;
    final_overall_score NUMERIC;

BEGIN
    -- 1. Determine which HotelID to update
    IF (TG_OP = 'DELETE') THEN
        hotel_id_to_update := OLD.HotelID;
    ELSE
        hotel_id_to_update := NEW.HotelID;
    END IF;

    -- 2. Get ALL-TIME rating and count (for Bayesian calculation)
    SELECT
        AVG(Hotel_Rating),
        COUNT(*)
    INTO
        avg_hotel_rating,
        total_review_count
    FROM
        Customer_Hotel_Review
    WHERE
        HotelID = hotel_id_to_update
        AND Hotel_Rating IS NOT NULL;

    -- 3. Get LATEST 100 sentiment scores (normalize from 0-100 to 0-1 scale)
    SELECT
        AVG(Hotel_Score) / 100.0
    INTO
        avg_hotel_sentiment
    FROM (
        SELECT Hotel_Score
        FROM Customer_Hotel_Review
        WHERE HotelID = hotel_id_to_update
          AND Hotel_Score IS NOT NULL
        ORDER BY Review_Date DESC
        LIMIT 100
    ) AS latest_reviews;

    -- 4. Calculate the Overall Scores
    IF total_review_count = 0 THEN
        avg_hotel_rating := 0;
        final_overall_score := 0;
    ELSE
        -- Bayesian rating calculation
        bayesian_rating_score := (
            (total_review_count * avg_hotel_rating) + 
            (min_confidence_threshold * global_avg_rating)
        ) / (total_review_count + min_confidence_threshold);
        
        -- Normalize rating from 1-5 scale to 0-1 scale
        normalized_rating_score := (bayesian_rating_score - 1) / 4.0;
        
        -- Calculate final weighted score
        final_overall_score := (
            weight_rating * normalized_rating_score
        ) + (
            weight_sentiment * COALESCE(avg_hotel_sentiment, 0)
        );
    END IF;

    -- 5. Update the Hotel table with calculated scores
    UPDATE Hotel
    SET 
        Overall_Rating = ROUND(COALESCE(avg_hotel_rating, 0)::NUMERIC, 1),
        Overall_Score = ROUND(final_overall_score::NUMERIC * 100, 0)
    WHERE 
        HotelID = hotel_id_to_update;

    IF (TG_OP = 'DELETE') THEN 
        RETURN OLD; 
    ELSE 
        RETURN NEW; 
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger with proper naming
CREATE TRIGGER trg_after_customer_hotel_review_changes
AFTER INSERT OR UPDATE OR DELETE ON Customer_Hotel_Review
FOR EACH ROW
EXECUTE FUNCTION fn_update_hotel_overall_scores();

-- =============================================
-- ROOM REVIEW TRIGGERS
-- =============================================

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS trg_after_customer_room_review_changes ON Customer_Room_Review;

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS fn_update_room_overall_scores();

-- Create the trigger function for room reviews
CREATE OR REPLACE FUNCTION fn_update_room_overall_scores()
RETURNS TRIGGER AS $$
DECLARE
    hotel_id_to_update VARCHAR(12);
    room_id_to_update VARCHAR(10);
    avg_room_rating NUMERIC;
    total_review_count INT;
    avg_room_sentiment NUMERIC;
    
    -- === TUNING PARAMETERS ===
    min_confidence_threshold INT := 30;
    global_avg_rating NUMERIC := 3.8;
    weight_rating NUMERIC := 0.7;
    weight_sentiment NUMERIC := 0.3;
    -- ===========================
    
    bayesian_rating_score NUMERIC;
    normalized_rating_score NUMERIC;
    final_overall_score NUMERIC;

BEGIN
    -- 1. Determine which Room to update
    IF (TG_OP = 'DELETE') THEN
        hotel_id_to_update := OLD.HotelID;
        room_id_to_update := OLD.RoomID;
    ELSE
        hotel_id_to_update := NEW.HotelID;
        room_id_to_update := NEW.RoomID;
    END IF;

    -- 2. Get ALL-TIME rating and count (for Bayesian calculation)
    SELECT
        AVG(Room_Rating),
        COUNT(*)
    INTO
        avg_room_rating,
        total_review_count
    FROM
        Customer_Room_Review
    WHERE
        HotelID = hotel_id_to_update
        AND RoomID = room_id_to_update
        AND Room_Rating IS NOT NULL;

    -- 3. Get LATEST 50 sentiment scores (normalize from 0-100 to 0-1 scale)
    SELECT
        AVG(Room_Score) / 100.0
    INTO
        avg_room_sentiment
    FROM (
        SELECT Room_Score
        FROM Customer_Room_Review
        WHERE HotelID = hotel_id_to_update
          AND RoomID = room_id_to_update
          AND Room_Score IS NOT NULL
        ORDER BY Review_Date DESC
        LIMIT 50
    ) AS latest_reviews;

    -- 4. Calculate the Overall Scores
    IF total_review_count = 0 THEN
        avg_room_rating := 0;
        final_overall_score := 0;
    ELSE
        -- Bayesian rating calculation
        bayesian_rating_score := (
            (total_review_count * avg_room_rating) + 
            (min_confidence_threshold * global_avg_rating)
        ) / (total_review_count + min_confidence_threshold);
        
        -- Normalize rating from 1-5 scale to 0-1 scale
        normalized_rating_score := (bayesian_rating_score - 1) / 4.0;
        
        -- Calculate final weighted score
        final_overall_score := (
            weight_rating * normalized_rating_score
        ) + (
            weight_sentiment * COALESCE(avg_room_sentiment, 0)
        );
    END IF;

    -- 5. Update the Room table with calculated scores
    UPDATE Room
    SET 
        Overall_Rating = ROUND(COALESCE(avg_room_rating, 0)::NUMERIC, 1),
        Overall_Score = ROUND(final_overall_score::NUMERIC * 100, 0)
    WHERE 
        HotelID = hotel_id_to_update
        AND RoomID = room_id_to_update;

    IF (TG_OP = 'DELETE') THEN 
        RETURN OLD; 
    ELSE 
        RETURN NEW; 
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger for room reviews
CREATE TRIGGER trg_after_customer_room_review_changes
AFTER INSERT OR UPDATE OR DELETE ON Customer_Room_Review
FOR EACH ROW
EXECUTE FUNCTION fn_update_room_overall_scores();

-- =============================================
-- DIRECT HOTEL RATING UPDATE TRIGGER
-- =============================================
-- This trigger ensures Overall_Score is recalculated when Overall_Rating is manually changed

DROP TRIGGER IF EXISTS trg_after_hotel_rating_update ON Hotel;
DROP FUNCTION IF EXISTS fn_recalculate_hotel_score_on_rating_change();

CREATE OR REPLACE FUNCTION fn_recalculate_hotel_score_on_rating_change()
RETURNS TRIGGER AS $$
DECLARE
    avg_hotel_sentiment NUMERIC;
    weight_rating NUMERIC := 0.7;
    weight_sentiment NUMERIC := 0.3;
    normalized_rating_score NUMERIC;
    final_overall_score NUMERIC;
BEGIN
    -- Only trigger if Overall_Rating was actually changed
    IF (TG_OP = 'UPDATE' AND OLD.Overall_Rating IS DISTINCT FROM NEW.Overall_Rating) THEN
        
        -- Get LATEST 100 sentiment scores
        SELECT
            AVG(Hotel_Score) / 100.0
        INTO
            avg_hotel_sentiment
        FROM (
            SELECT Hotel_Score
            FROM Customer_Hotel_Review
            WHERE HotelID = NEW.HotelID
              AND Hotel_Score IS NOT NULL
            ORDER BY Review_Date DESC
            LIMIT 100
        ) AS latest_reviews;
        
        -- Calculate Overall_Score based on new Overall_Rating
        IF NEW.Overall_Rating > 0 THEN
            -- Normalize rating from 1-5 scale to 0-1 scale
            normalized_rating_score := (NEW.Overall_Rating - 1) / 4.0;
            
            -- Calculate final weighted score
            final_overall_score := (
                weight_rating * normalized_rating_score
            ) + (
                weight_sentiment * COALESCE(avg_hotel_sentiment, 0)
            );
            
            NEW.Overall_Score := ROUND(final_overall_score::NUMERIC * 100, 0);
        ELSE
            NEW.Overall_Score := 0;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_after_hotel_rating_update
BEFORE UPDATE ON Hotel
FOR EACH ROW
EXECUTE FUNCTION fn_recalculate_hotel_score_on_rating_change();

-- =============================================
-- DIRECT ROOM RATING UPDATE TRIGGER
-- =============================================
-- This trigger ensures Overall_Score is recalculated when Overall_Rating is manually changed

DROP TRIGGER IF EXISTS trg_after_room_rating_update ON Room;
DROP FUNCTION IF EXISTS fn_recalculate_room_score_on_rating_change();

CREATE OR REPLACE FUNCTION fn_recalculate_room_score_on_rating_change()
RETURNS TRIGGER AS $$
DECLARE
    avg_room_sentiment NUMERIC;
    weight_rating NUMERIC := 0.7;
    weight_sentiment NUMERIC := 0.3;
    normalized_rating_score NUMERIC;
    final_overall_score NUMERIC;
BEGIN
    -- Only trigger if Overall_Rating was actually changed
    IF (TG_OP = 'UPDATE' AND OLD.Overall_Rating IS DISTINCT FROM NEW.Overall_Rating) THEN
        
        -- Get LATEST 50 sentiment scores
        SELECT
            AVG(Room_Score) / 100.0
        INTO
            avg_room_sentiment
        FROM (
            SELECT Room_Score
            FROM Customer_Room_Review
            WHERE HotelID = NEW.HotelID
              AND RoomID = NEW.RoomID
              AND Room_Score IS NOT NULL
            ORDER BY Review_Date DESC
            LIMIT 50
        ) AS latest_reviews;
        
        -- Calculate Overall_Score based on new Overall_Rating
        IF NEW.Overall_Rating > 0 THEN
            -- Normalize rating from 1-5 scale to 0-1 scale
            normalized_rating_score := (NEW.Overall_Rating - 1) / 4.0;
            
            -- Calculate final weighted score
            final_overall_score := (
                weight_rating * normalized_rating_score
            ) + (
                weight_sentiment * COALESCE(avg_room_sentiment, 0)
            );
            
            NEW.Overall_Score := ROUND(final_overall_score::NUMERIC * 100, 0);
        ELSE
            NEW.Overall_Score := 0;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_after_room_rating_update
BEFORE UPDATE ON Room
FOR EACH ROW
EXECUTE FUNCTION fn_recalculate_room_score_on_rating_change();
