

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";





SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."couponRedeem" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "coupon_id" "text",
    "amount" bigint,
    "expirationDate" timestamp with time zone,
    "user_id" "text",
    "user_email" "text",
    "user_phone" bigint,
    "token" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "status" "text" DEFAULT 'redeemed'::"text" NOT NULL,
    "establishment_id" "text" NOT NULL,
    "user_name" "text" NOT NULL
);


ALTER TABLE "public"."couponRedeem" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."couponTemplate" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text",
    "description" "text",
    "value" bigint,
    "type" "text",
    "amount" bigint,
    "startPromotionDate" "date",
    "expirationDate" "date",
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "establishment" "json" NOT NULL,
    "establishmentId" "text" NOT NULL,
    "banner_url" "text",
    "gallery_images" "text"
);


ALTER TABLE "public"."couponTemplate" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."establishment" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text",
    "document" bigint,
    "phone" bigint,
    "postal_code" "text",
    "city" "text",
    "state" "text",
    "neighborhood" "text",
    "number" bigint,
    "complement" "text",
    "created_at" timestamp without time zone DEFAULT "now"(),
    "updated_at" timestamp without time zone DEFAULT "now"(),
    "email" "text",
    "street" "text",
    "role" "text",
    "user_id" "text"
);


ALTER TABLE "public"."establishment" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "role" "text" DEFAULT 'customer'::"text" NOT NULL,
    "password" "text",
    "name" "text",
    "birthday" "text",
    "document" "text",
    "email" "text",
    "phone" bigint,
    "created_at" timestamp without time zone DEFAULT "now"(),
    "updated_at" timestamp without time zone DEFAULT "now"(),
    "address" "json"
);


ALTER TABLE "public"."user" OWNER TO "postgres";


ALTER TABLE ONLY "public"."couponRedeem"
    ADD CONSTRAINT "couponRedeem_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."couponTemplate"
    ADD CONSTRAINT "couponTemplate_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."establishment"
    ADD CONSTRAINT "establishment_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user"
    ADD CONSTRAINT "user_pkey" PRIMARY KEY ("id");



CREATE POLICY "Enable delete for establishments" ON "public"."couponTemplate" FOR DELETE TO "authenticated" USING ((("auth"."uid"())::"text" = "establishmentId"));



CREATE POLICY "Enable insert for establishments" ON "public"."couponTemplate" FOR INSERT TO "authenticated" WITH CHECK ((("auth"."uid"())::"text" = "establishmentId"));



CREATE POLICY "Enable read access for authenticated users" ON "public"."couponTemplate" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Enable update for establishments" ON "public"."couponTemplate" FOR UPDATE TO "authenticated" USING ((("auth"."uid"())::"text" = "establishmentId"));



ALTER TABLE "public"."couponRedeem" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."couponTemplate" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."establishment" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



































































































































































































GRANT ALL ON TABLE "public"."couponRedeem" TO "anon";
GRANT ALL ON TABLE "public"."couponRedeem" TO "authenticated";
GRANT ALL ON TABLE "public"."couponRedeem" TO "service_role";



GRANT ALL ON TABLE "public"."couponTemplate" TO "anon";
GRANT ALL ON TABLE "public"."couponTemplate" TO "authenticated";
GRANT ALL ON TABLE "public"."couponTemplate" TO "service_role";



GRANT ALL ON TABLE "public"."establishment" TO "anon";
GRANT ALL ON TABLE "public"."establishment" TO "authenticated";
GRANT ALL ON TABLE "public"."establishment" TO "service_role";



GRANT ALL ON TABLE "public"."user" TO "anon";
GRANT ALL ON TABLE "public"."user" TO "authenticated";
GRANT ALL ON TABLE "public"."user" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
