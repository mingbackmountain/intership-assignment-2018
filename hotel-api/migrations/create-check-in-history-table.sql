CREATE TABLE IF NOT EXISTS check_in_histories (
	id SERIAL PRIMARY KEY,
	name TEXT NOT NULL,
	age int4 NOT NULL,
	room_no TEXT NOT NULL,
	floor int4 NOT NULL,
	hotel_id TEXT NOT NULL,
	keycard_no int4 NOT NULL
);