CREATE TYPE "puzzle_difficulty" AS ENUM('normal', 'hard');--> statement-breakpoint
CREATE TYPE "puzzle_publication_status" AS ENUM('draft', 'published', 'unpublished');--> statement-breakpoint
CREATE TYPE "puzzle_solver_method" AS ENUM('simple', 'four');--> statement-breakpoint
CREATE TYPE "puzzle_type" AS ENUM('system', 'daily', 'community');--> statement-breakpoint
CREATE TYPE "puzzle_validation_status" AS ENUM('pending', 'valid', 'invalid');--> statement-breakpoint
CREATE TABLE "puzzles" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "puzzles_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"type" "puzzle_type" NOT NULL,
	"height" smallint NOT NULL,
	"width" smallint NOT NULL,
	"rowClues" jsonb NOT NULL,
	"columnClues" jsonb NOT NULL,
	"solutionBits" text NOT NULL,
	"solutionHash" text NOT NULL,
	"difficulty" "puzzle_difficulty",
	"solverMethod" "puzzle_solver_method",
	"simpleSolverSweepCount" integer DEFAULT 0 NOT NULL,
	"fourSolverStepCount" integer DEFAULT 0 NOT NULL,
	"filledCellCount" smallint NOT NULL,
	"publicationStatus" "puzzle_publication_status" DEFAULT 'draft'::"puzzle_publication_status" NOT NULL,
	"validationStatus" "puzzle_validation_status" DEFAULT 'pending'::"puzzle_validation_status" NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "puzzle_height_range" CHECK ("height" BETWEEN 5 AND 30),
	CONSTRAINT "puzzle_width_range" CHECK ("width" BETWEEN 5 AND 30),
	CONSTRAINT "puzzle_solution_length" CHECK (length("solutionBits") = "height" * "width"),
	CONSTRAINT "puzzle_binary_solution" CHECK ("solutionBits" ~ '^[01]+$'),
	CONSTRAINT "puzzle_filled_cell_count" CHECK ("filledCellCount" = length(replace("solutionBits", '0', ''))),
	CONSTRAINT "puzzle_row_clues_array" CHECK (jsonb_typeof("rowClues") = 'array'),
	CONSTRAINT "puzzle_column_clues_array" CHECK (jsonb_typeof("columnClues") = 'array'),
	CONSTRAINT "puzzle_clue_dimensions" CHECK (jsonb_array_length("rowClues") = "height" AND jsonb_array_length("columnClues") = "width"),
	CONSTRAINT "system_puzzle_difficulty" CHECK ("type" <> 'system' OR "difficulty" IS NOT NULL),
	CONSTRAINT "puzzle_difficulty_solver_consistency" CHECK (
    ("difficulty" IS NULL AND "solverMethod" IS NULL)
    OR ("difficulty" IS NOT NULL
      AND "solverMethod" IS NOT NULL
      AND (
        ("difficulty" = 'normal' AND "solverMethod" = 'simple')
        OR ("difficulty" = 'hard' AND "solverMethod" = 'four')
      )
    )
  ),
	CONSTRAINT "simple_solver_sweep_count_nonnegative" CHECK ("simpleSolverSweepCount" IS NULL OR "simpleSolverSweepCount" >= 0),
	CONSTRAINT "four_solver_step_count_nonnegative" CHECK ("fourSolverStepCount" IS NULL OR "fourSolverStepCount" >= 0),
	CONSTRAINT "published_puzzle_valid" CHECK ("publicationStatus" <> 'published' OR "validationStatus" = 'valid'),
	CONSTRAINT "published_system_puzzle_solver_required" CHECK ("type" <> 'system'
    OR "publicationStatus" <> 'published'
    OR (
      "difficulty" IS NOT NULL
      AND "solverMethod" IS NOT NULL
      AND "simpleSolverSweepCount" IS NOT NULL
      AND "fourSolverStepCount" IS NOT NULL
    )
  ),
	CONSTRAINT "puzzle_solver_step_consistency" CHECK (
    "solverMethod" IS NULL
    OR (
      "solverMethod" = 'simple'
      AND "simpleSolverSweepCount" > 0
      AND "fourSolverStepCount" = 0
    )
    OR (
      "solverMethod" = 'four'
      AND "simpleSolverSweepCount" >= 0
      AND "fourSolverStepCount" > 0
    )
  )
);
--> statement-breakpoint
CREATE UNIQUE INDEX "unique_system_puzzle_solution" ON "puzzles" ("height","width","solutionHash") WHERE "type" = 'system';--> statement-breakpoint
CREATE INDEX "puzzles_selection_index" ON "puzzles" ("height","width","difficulty","id") WHERE 
    "type" = 'system' AND "publicationStatus" = 'published'
  ;