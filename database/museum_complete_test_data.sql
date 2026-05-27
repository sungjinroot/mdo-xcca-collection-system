--
-- PostgreSQL database dump
--

\restrict 95quzmcogmw8e5czC6j21vIQqfo4YVDgJWWHVp1CY3MySJnqrLXmX2WbyRqgOdA

-- Dumped from database version 15.17 (Debian 15.17-1.pgdg13+1)
-- Dumped by pg_dump version 15.17 (Debian 15.17-1.pgdg13+1)

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

--
-- Data for Name: catalogue; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.catalogue (catalogueno, cataloguename) VALUES ('A1', 'Prehistoric Items');
INSERT INTO public.catalogue (catalogueno, cataloguename) VALUES ('A2', 'Ethnographic Objects');
INSERT INTO public.catalogue (catalogueno, cataloguename) VALUES ('A3', 'Colonial Era Artifacts');
INSERT INTO public.catalogue (catalogueno, cataloguename) VALUES ('A4', 'Religious Items');
INSERT INTO public.catalogue (catalogueno, cataloguename) VALUES ('A5', 'Household Objects');


--
-- Data for Name: rooms; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.rooms (roomid, title, roomname, caption, roompictureurl) VALUES (1, 'Heritage Gallery', 'Ancient Artifacts Exhibit', 'Discover the rich cultural heritage of pre-colonial Philippines', 'http://127.0.0.1:3000/uploads/rooms/1779890410103-859789368.jpg');
INSERT INTO public.rooms (roomid, title, roomname, caption, roompictureurl) VALUES (2, 'Textile Wing', 'Weaving Traditions', 'Traditional Filipino textiles and weaving techniques from various ethnic groups', 'http://127.0.0.1:3000/uploads/rooms/1779890709095-786932618.jpg');
INSERT INTO public.rooms (roomid, title, roomname, caption, roompictureurl) VALUES (3, 'Maritime Gallery', 'Ancient Sea Trade', 'Discover balangays, trading vessels, and maritime artifacts that connected the Philippines to Southeast Asia', 'http://127.0.0.1:3000/uploads/rooms/1779890872018-383596357.jpg');


--
-- Data for Name: artifacts; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.artifacts (artifactid, accessionno, catalogueno, roomid, storagelocation) VALUES (1, 'ACC-001', 'A1', 1, 'Shelf A1 - Bay 2');
INSERT INTO public.artifacts (artifactid, accessionno, catalogueno, roomid, storagelocation) VALUES (2, 'ACC-002', 'A1', 1, 'Shelf A2 - Bay 1');
INSERT INTO public.artifacts (artifactid, accessionno, catalogueno, roomid, storagelocation) VALUES (3, 'ACC-003', 'A1', 1, 'Vault Cabinet 1 - Display Case A');
INSERT INTO public.artifacts (artifactid, accessionno, catalogueno, roomid, storagelocation) VALUES (4, 'ACC-004', 'A2', 2, 'Textile Cabinet 1 - Drawer A');
INSERT INTO public.artifacts (artifactid, accessionno, catalogueno, roomid, storagelocation) VALUES (5, 'ACC-005', 'A2', 2, 'Shelf B1 - Weaving Section');
INSERT INTO public.artifacts (artifactid, accessionno, catalogueno, roomid, storagelocation) VALUES (6, 'ACC-006', 'A3', 3, 'Shelf M1 - Bay 3');
INSERT INTO public.artifacts (artifactid, accessionno, catalogueno, roomid, storagelocation) VALUES (7, 'ACC-007', 'A3', 3, 'Shelf M2 - Bay 1');


--
-- Data for Name: collection; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.collection (collectiontype, collectionname) VALUES ('A', 'Donated');
INSERT INTO public.collection (collectiontype, collectionname) VALUES ('B', 'On Loan');
INSERT INTO public.collection (collectiontype, collectionname) VALUES ('C', 'Excavated');
INSERT INTO public.collection (collectiontype, collectionname) VALUES ('D', 'Found');
INSERT INTO public.collection (collectiontype, collectionname) VALUES ('E', 'Purchased');


--
-- Data for Name: acquisition; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.acquisition (artifactid, collectiontype, price) VALUES (1, 'A', NULL);
INSERT INTO public.acquisition (artifactid, collectiontype, price) VALUES (2, 'A', NULL);
INSERT INTO public.acquisition (artifactid, collectiontype, price) VALUES (3, 'D', NULL);
INSERT INTO public.acquisition (artifactid, collectiontype, price) VALUES (4, 'E', 3500);
INSERT INTO public.acquisition (artifactid, collectiontype, price) VALUES (5, 'A', NULL);
INSERT INTO public.acquisition (artifactid, collectiontype, price) VALUES (6, 'B', NULL);
INSERT INTO public.acquisition (artifactid, collectiontype, price) VALUES (7, 'C', NULL);


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.categories (categoryid, categoryname) VALUES (15, 'Pottery');
INSERT INTO public.categories (categoryid, categoryname) VALUES (16, 'Ceremonial Objects');
INSERT INTO public.categories (categoryid, categoryname) VALUES (17, 'Ancient Tools');
INSERT INTO public.categories (categoryid, categoryname) VALUES (18, 'Burial Artifacts');
INSERT INTO public.categories (categoryid, categoryname) VALUES (19, 'Jewelry');
INSERT INTO public.categories (categoryid, categoryname) VALUES (20, 'Textiles');
INSERT INTO public.categories (categoryid, categoryname) VALUES (21, 'Weaving Tools');
INSERT INTO public.categories (categoryid, categoryname) VALUES (22, 'Traditional Clothing');
INSERT INTO public.categories (categoryid, categoryname) VALUES (23, 'Beadwork');
INSERT INTO public.categories (categoryid, categoryname) VALUES (24, 'Natural Dyes');
INSERT INTO public.categories (categoryid, categoryname) VALUES (25, 'Maritime Trade');
INSERT INTO public.categories (categoryid, categoryname) VALUES (26, 'Fishing Gear');
INSERT INTO public.categories (categoryid, categoryname) VALUES (27, 'Boat Artifacts');
INSERT INTO public.categories (categoryid, categoryname) VALUES (28, 'Navigation Tools');
INSERT INTO public.categories (categoryid, categoryname) VALUES (29, 'Underwater Finds');


--
-- Data for Name: artifactcategories; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.artifactcategories (artifactid, categoryid) VALUES (1, 15);
INSERT INTO public.artifactcategories (artifactid, categoryid) VALUES (1, 16);
INSERT INTO public.artifactcategories (artifactid, categoryid) VALUES (1, 18);
INSERT INTO public.artifactcategories (artifactid, categoryid) VALUES (2, 16);
INSERT INTO public.artifactcategories (artifactid, categoryid) VALUES (3, 19);
INSERT INTO public.artifactcategories (artifactid, categoryid) VALUES (3, 16);
INSERT INTO public.artifactcategories (artifactid, categoryid) VALUES (4, 20);
INSERT INTO public.artifactcategories (artifactid, categoryid) VALUES (4, 22);
INSERT INTO public.artifactcategories (artifactid, categoryid) VALUES (5, 21);
INSERT INTO public.artifactcategories (artifactid, categoryid) VALUES (5, 20);
INSERT INTO public.artifactcategories (artifactid, categoryid) VALUES (6, 27);
INSERT INTO public.artifactcategories (artifactid, categoryid) VALUES (6, 25);
INSERT INTO public.artifactcategories (artifactid, categoryid) VALUES (7, 26);
INSERT INTO public.artifactcategories (artifactid, categoryid) VALUES (7, 25);


--
-- Data for Name: artifactnames; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.artifactnames (artifactid, englishname, vernacularname) VALUES (1, 'Ancient Burial Jar', 'Tapayan');
INSERT INTO public.artifactnames (artifactid, englishname, vernacularname) VALUES (2, 'Ritual Offering Bowl', 'Dulang');
INSERT INTO public.artifactnames (artifactid, englishname, vernacularname) VALUES (3, 'Gold Pendant', 'Panika');
INSERT INTO public.artifactnames (artifactid, englishname, vernacularname) VALUES (4, 'Traditional Woven Skirt', 'Malong');
INSERT INTO public.artifactnames (artifactid, englishname, vernacularname) VALUES (5, 'Backstrap Loom', 'Pagsiyab');
INSERT INTO public.artifactnames (artifactid, englishname, vernacularname) VALUES (6, 'Ancient Boat Model', 'Balangay');
INSERT INTO public.artifactnames (artifactid, englishname, vernacularname) VALUES (7, 'Traditional Fishing Net', 'Lambat');


--
-- Data for Name: artifactprovenance; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.artifactprovenance (artifactid, ethnicgroup, locality, placeoforigin) VALUES (1, 'Maranao', 'Lanao del Sur', 'Mindanao');
INSERT INTO public.artifactprovenance (artifactid, ethnicgroup, locality, placeoforigin) VALUES (2, 'Tagbanua', 'Aborian', 'Palawan');
INSERT INTO public.artifactprovenance (artifactid, ethnicgroup, locality, placeoforigin) VALUES (3, 'Visayan', 'Oslob', 'Cebu');
INSERT INTO public.artifactprovenance (artifactid, ethnicgroup, locality, placeoforigin) VALUES (4, 'Maguindanao', 'Cotabato City', 'Mindanao');
INSERT INTO public.artifactprovenance (artifactid, ethnicgroup, locality, placeoforigin) VALUES (5, 'T''boli', 'Lake Sebu', 'South Cotabato');
INSERT INTO public.artifactprovenance (artifactid, ethnicgroup, locality, placeoforigin) VALUES (6, 'Butuanon', 'Butuan City', 'Agusan del Norte');
INSERT INTO public.artifactprovenance (artifactid, ethnicgroup, locality, placeoforigin) VALUES (7, 'Sama-Bajau', 'Sitangkai', 'Sulu Archipelago');


--
-- Data for Name: contactpersons; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.contactpersons (artifactid, contactpersonfullname, datecollectedbycontactperson, receiverfullname, receivedbyreceiverdate, recordedby) VALUES (1, 'Juan dela Cruz', '2023-01-15', 'Maria Santos', '2023-02-01', 'Dr. Reyes');
INSERT INTO public.contactpersons (artifactid, contactpersonfullname, datecollectedbycontactperson, receiverfullname, receivedbyreceiverdate, recordedby) VALUES (2, 'Elena Rodriguez', '2025-03-13', 'Antonio Mendoza', '2026-05-19', 'Dr. Santos');
INSERT INTO public.contactpersons (artifactid, contactpersonfullname, datecollectedbycontactperson, receiverfullname, receivedbyreceiverdate, recordedby) VALUES (3, 'Inez Cabrera', '2025-07-08', 'Maria Santos', '2026-05-04', 'Dr. Reyes');
INSERT INTO public.contactpersons (artifactid, contactpersonfullname, datecollectedbycontactperson, receiverfullname, receivedbyreceiverdate, recordedby) VALUES (4, 'Fatima Alonto', '2026-02-10', 'Cristina Lopez', '2026-04-15', 'Dr. Reyes');
INSERT INTO public.contactpersons (artifactid, contactpersonfullname, datecollectedbycontactperson, receiverfullname, receivedbyreceiverdate, recordedby) VALUES (5, 'Barbara Ofong', '2026-02-10', 'Maria Santos', '2026-07-30', 'Dr. Santos');
INSERT INTO public.contactpersons (artifactid, contactpersonfullname, datecollectedbycontactperson, receiverfullname, receivedbyreceiverdate, recordedby) VALUES (6, 'National Museum', '2025-11-27', 'Antonio Mendoza', '2026-03-10', 'Dr. Reyes');
INSERT INTO public.contactpersons (artifactid, contactpersonfullname, datecollectedbycontactperson, receiverfullname, receivedbyreceiverdate, recordedby) VALUES (7, 'Hadji Abdulrahman', '2025-11-27', 'Cristina Lopez', '2026-01-26', 'Dr. Santos');


--
-- Data for Name: dimensions; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.dimensions (artifactid, artifactlength, artifactwidth, artifactheight, artifactdiameter) VALUES (1, 25, 25, 30, 28);
INSERT INTO public.dimensions (artifactid, artifactlength, artifactwidth, artifactheight, artifactdiameter) VALUES (2, 35, 35, 15, 35);
INSERT INTO public.dimensions (artifactid, artifactlength, artifactwidth, artifactheight, artifactdiameter) VALUES (3, 4.5, 0.5, 3, NULL);
INSERT INTO public.dimensions (artifactid, artifactlength, artifactwidth, artifactheight, artifactdiameter) VALUES (4, 165, 90, 165, NULL);
INSERT INTO public.dimensions (artifactid, artifactlength, artifactwidth, artifactheight, artifactdiameter) VALUES (5, 120, 25, 10, NULL);
INSERT INTO public.dimensions (artifactid, artifactlength, artifactwidth, artifactheight, artifactdiameter) VALUES (6, 120, 25, 45, NULL);
INSERT INTO public.dimensions (artifactid, artifactlength, artifactwidth, artifactheight, artifactdiameter) VALUES (7, 300, 200, 300, NULL);


--
-- Data for Name: physicaldescription; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.physicaldescription (artifactid, artifactdetails, artifactfunction, conditionuponreceipt, specialremarks) VALUES (1, 'Earthenware burial jar with geometric incised designs', 'Used for secondary burial of ancestors', 'Good - minor cracks on rim', 'Restored in 2023');
INSERT INTO public.physicaldescription (artifactid, artifactdetails, artifactfunction, conditionuponreceipt, specialremarks) VALUES (2, 'Wooden ceremonial bowl with carved animal motifs', 'Used for rice offerings during harvest rituals', 'Excellent', 'Still used in annual ceremonies');
INSERT INTO public.physicaldescription (artifactid, artifactdetails, artifactfunction, conditionuponreceipt, specialremarks) VALUES (3, '	Intricately crafted gold pendant depicting a floral motif', 'Worn as status symbol and ceremonial adornment', 'Excellent - well-preserved', 'Pre-colonial goldwork');
INSERT INTO public.physicaldescription (artifactid, artifactdetails, artifactfunction, conditionuponreceipt, specialremarks) VALUES (4, '	Handwoven tubular garment with geometric patterns in red, gold, and blue', '	Worn as formal attire during weddings and festivals', 'Good - some fading', 'Made from abaca fibers with natural dyes');
INSERT INTO public.physicaldescription (artifactid, artifactdetails, artifactfunction, conditionuponreceipt, specialremarks) VALUES (5, 'Complete backstrap loom set with bamboo rods and cotton threads', 'Used for traditional T''boli textile weaving (T''nalak)', 'Functional - some wear on straps', 'Still operational');
INSERT INTO public.physicaldescription (artifactid, artifactdetails, artifactfunction, conditionuponreceipt, specialremarks) VALUES (6, 'Miniature replica of ancient balangay boat with intricately carved prow', 'Educational model showing traditional boat-building technique', 'Excellent', 'Based on 9th century archaeological find');
INSERT INTO public.physicaldescription (artifactid, artifactdetails, artifactfunction, conditionuponreceipt, specialremarks) VALUES (7, 'Hand-woven fishing net made from abaca fibers with wooden floats', 'Used for traditional fishing methods', 'Worn - needs conservation', 'Collected from sea-based community');


--
-- Data for Name: pictures; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.pictures (pictureid, anglename, picturefilepath, artifactid, isprofilepicture) VALUES (1, 'front', 'http://127.0.0.1:3000/uploads/artifacts/1779892285814-260203947.jpg', 1, true);
INSERT INTO public.pictures (pictureid, anglename, picturefilepath, artifactid, isprofilepicture) VALUES (2, 'front', 'http://127.0.0.1:3000/uploads/artifacts/1779892875266-767021167.jpg', 2, true);
INSERT INTO public.pictures (pictureid, anglename, picturefilepath, artifactid, isprofilepicture) VALUES (3, 'front', 'http://127.0.0.1:3000/uploads/artifacts/1779893795930-585253248.jpg', 3, true);
INSERT INTO public.pictures (pictureid, anglename, picturefilepath, artifactid, isprofilepicture) VALUES (4, 'front', 'http://127.0.0.1:3000/uploads/artifacts/1779893858185-418998507.jpg', 4, true);
INSERT INTO public.pictures (pictureid, anglename, picturefilepath, artifactid, isprofilepicture) VALUES (5, 'front', 'http://127.0.0.1:3000/uploads/artifacts/1779893921032-612967179.png', 5, true);
INSERT INTO public.pictures (pictureid, anglename, picturefilepath, artifactid, isprofilepicture) VALUES (6, 'front', 'http://127.0.0.1:3000/uploads/artifacts/1779894006125-906346455.jpg', 6, true);
INSERT INTO public.pictures (pictureid, anglename, picturefilepath, artifactid, isprofilepicture) VALUES (7, 'front', 'http://127.0.0.1:3000/uploads/artifacts/1779894051578-709314079.jpg', 7, true);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Name: artifacts_artifactid_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.artifacts_artifactid_seq', 7, true);


--
-- Name: categories_categoryid_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.categories_categoryid_seq', 29, true);


--
-- Name: pictures_pictureid_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.pictures_pictureid_seq', 7, true);


--
-- Name: rooms_roomid_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.rooms_roomid_seq', 3, true);


--
-- Name: users_userid_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_userid_seq', 1, false);


--
-- PostgreSQL database dump complete
--

\unrestrict 95quzmcogmw8e5czC6j21vIQqfo4YVDgJWWHVp1CY3MySJnqrLXmX2WbyRqgOdA

