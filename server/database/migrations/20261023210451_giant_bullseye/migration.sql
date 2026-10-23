CREATE TYPE "puzzle_difficulty" AS ENUM('normal', 'hard');--> statement-breakpoint
CREATE TYPE "puzzle_generator" AS ENUM('batenburg-kosters', 'tatham');--> statement-breakpoint
CREATE TYPE "puzzle_publication_status" AS ENUM('draft', 'published', 'unpublished');--> statement-breakpoint
CREATE TYPE "puzzle_solver" AS ENUM('line', 'four');--> statement-breakpoint
CREATE TYPE "puzzle_type" AS ENUM('system', 'daily', 'community');--> statement-breakpoint
CREATE TYPE "puzzle_validation_status" AS ENUM('pending', 'valid', 'invalid');--> statement-breakpoint
CREATE TABLE "puzzles" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "puzzles_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"slug" varchar(128) NOT NULL,
	"type" "puzzle_type" NOT NULL,
	"height" smallint NOT NULL,
	"width" smallint NOT NULL,
	"row_clues" jsonb NOT NULL,
	"column_clues" jsonb NOT NULL,
	"solution_bits" text NOT NULL,
	"solution_hash" text NOT NULL,
	"filled_cell_count" smallint GENERATED ALWAYS AS (length(replace("solution_bits", '0', ''))) STORED,
	"difficulty" "puzzle_difficulty",
	"generator" "puzzle_generator",
	"solver" "puzzle_solver",
	"line_solver_iteration_count" integer,
	"four_solver_intersection_count" integer,
	"publication_status" "puzzle_publication_status" DEFAULT 'draft'::"puzzle_publication_status" NOT NULL,
	"validation_status" "puzzle_validation_status" DEFAULT 'pending'::"puzzle_validation_status" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "slug_format" CHECK ("slug" ~* '^[a-z0-9]([a-z0-9_-]*[a-z0-9])?$'),
	CONSTRAINT "slug_min_length" CHECK (char_length("slug") >= 3),
	CONSTRAINT "height_range" CHECK ("height" BETWEEN 5 AND 30),
	CONSTRAINT "width_range" CHECK ("width" BETWEEN 5 AND 30),
	CONSTRAINT "solution_length" CHECK (length("solution_bits") = "height" * "width"),
	CONSTRAINT "binary_solution" CHECK ("solution_bits" ~ '^[01]+$'),
	CONSTRAINT "row_clues_array" CHECK (jsonb_typeof("row_clues") = 'array'),
	CONSTRAINT "column_clues_array" CHECK (jsonb_typeof("column_clues") = 'array'),
	CONSTRAINT "clue_dimensions" CHECK (
    CASE
      WHEN jsonb_typeof("row_clues") = 'array'
        AND jsonb_typeof("column_clues") = 'array'
      THEN
        jsonb_array_length("row_clues") = "height"
        AND jsonb_array_length("column_clues") = "width"
      ELSE TRUE
    END
  ),
	CONSTRAINT "generator_consistency" CHECK (
    "type" NOT IN ('system', 'daily')
    OR "generator" IS NOT NULL
  ),
	CONSTRAINT "difficulty_solver_consistency" CHECK (
    ("difficulty" IS NULL AND "solver" IS NULL)
    OR (
      "difficulty" IS NOT NULL
      AND "solver" IS NOT NULL
      AND (
        ("difficulty" = 'normal' AND "solver" = 'line')
        OR ("difficulty" = 'hard' AND "solver" = 'four')
      )
    )
  ),
	CONSTRAINT "line_solver_iteration_count_nonnegative" CHECK ("line_solver_iteration_count" >= 0),
	CONSTRAINT "four_solver_intersection_count_nonnegative" CHECK ("four_solver_intersection_count" >= 0),
	CONSTRAINT "published_puzzle_validity" CHECK ("publication_status" <> 'published' OR "validation_status" = 'valid'),
	CONSTRAINT "solver_iteration_intersection_consistency" CHECK (
    "solver" IS NULL
    OR (
      "solver" = 'line'
      AND "line_solver_iteration_count" > 0
      AND "four_solver_intersection_count" = 0
    )
    OR (
      "solver" = 'four'
      AND "line_solver_iteration_count" >= 0
      AND "four_solver_intersection_count" > 0
    )
  ),
	CONSTRAINT "validation_solver_consistency" CHECK (
    (
      "validation_status" <> 'valid'
      AND "difficulty" IS NULL
      AND "solver" IS NULL
      AND "line_solver_iteration_count" IS NULL
      AND "four_solver_intersection_count" IS NULL
    )
    OR (
      "validation_status" = 'valid'
      AND "difficulty" IS NOT NULL
      AND "solver" IS NOT NULL
      AND "line_solver_iteration_count" IS NOT NULL
      AND "four_solver_intersection_count" IS NOT NULL
    )
  )
);
--> statement-breakpoint
CREATE UNIQUE INDEX "puzzles_slug_unique" ON "puzzles" (lower("slug"));--> statement-breakpoint
CREATE UNIQUE INDEX "puzzles_system_puzzle_solution_unique" ON "puzzles" ("height","width","solution_hash") WHERE "type" = 'system';--> statement-breakpoint
CREATE UNIQUE INDEX "puzzles_daily_puzzle_solution_unique" ON "puzzles" ("height","width","solution_hash") WHERE "type" = 'daily';--> statement-breakpoint
CREATE INDEX "puzzles_selection_index" ON "puzzles" ("height","width","difficulty","id") WHERE 
    "type" = 'system' AND "publication_status" = 'published'
  ;