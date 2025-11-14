-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS trg_after_customer_hotel_review_changes ON Customer_Hotel_Review;

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS fn_update_hotel_overall_scores();

-- Create the trigger function with proper naming
CREATE OR REPLACE FUNCTION fn_update_hotel_overall_scores()
RETURNS TRIGGER AS $$
DECLARE
    hotel_id_to_update INT;
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
        HotelID = hotel_id_to_update;

    -- 3. Get LATEST 100 sentiment scores
    SELECT
        AVG(Hotel_Score)
    INTO
        avg_hotel_sentiment
    FROM (
        SELECT Hotel_Score
        FROM Customer_Hotel_Review
        WHERE HotelID = hotel_id_to_update
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
        Overall_Rating = COALESCE(avg_hotel_rating, 0),
        Overall_Score = ROUND(final_overall_score::NUMERIC, 0)
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
