CREATE TABLE IF NOT EXISTS booking_histories (
	id SERIAL PRIMARY KEY,
	name TEXT NOT NULL,
	age int4 NOT NULL,
	room_no TEXT NOT NULL,
	is_check_in BOOLEAN NOT NULL,
	floor int4 NOT NULL,
	hotel_id TEXT NOT NULL
);