-- Seed real property listings extracted from old WordPress site

-- Clear existing mockup listings, locations, and images
DELETE FROM listing_images;
DELETE FROM listings;
DELETE FROM listing_locations;

-- Seed real locations
INSERT OR REPLACE INTO listing_locations (id, state, city, locality, area, pincode, address, latitude, longitude, privacy)
VALUES
('loc-aara-vista', 'Tamil Nadu', 'Coimbatore', 'Kalapatti', 'Aara Vista', '641048', 'Aara Vista Gated Layout, Kalapatti, Coimbatore', 11.0594, 77.0371, 'exact'),
('loc-kailash-nagar', 'Tamil Nadu', 'Coimbatore', 'Periyanaickenpalayam', 'Kailash Nagar', '641020', 'Kailash Nagar, Periyanaickenpalayam, Coimbatore', 11.1352, 76.9385, 'exact'),
('loc-balaji-garden', 'Tamil Nadu', 'Coimbatore', 'Teachers Colony', 'Balaji Garden', '641047', 'Balaji Garden, Teachers Colony, Coimbatore', 11.0825, 77.0123, 'exact'),
('loc-golden-bujanganur', 'Tamil Nadu', 'Coimbatore', 'Bujanganur', 'Sri Golden City', '641113', 'Sri Golden City, Bujanganur, Coimbatore', 11.2312, 76.9123, 'exact'),
('loc-golden-annur', 'Tamil Nadu', 'Coimbatore', 'Annur', 'Sri Golden City', '641653', 'Sri Golden City, Annur, Coimbatore', 11.2325, 77.1294, 'exact'),
('loc-aara-urbania', 'Tamil Nadu', 'Coimbatore', 'Vellalore', 'Aara Urbania', '641111', 'Aara Urbania, Vellalore, Coimbatore', 10.9621, 77.0194, 'exact'),
('loc-blue-diamond', 'Tamil Nadu', 'Ooty', 'Fern Hill', 'Fern Hill Road', '643004', 'Blue Diamond Bungalow, Fern Hill Road, Ooty', 11.3984, 76.6946, 'exact'),
('loc-baraliyar', 'Tamil Nadu', 'Ooty', 'Burliyar', 'Burliyar Tea Estates', '643102', '56 Acres Baraliyar Estate, Burliyar, Ooty', 11.3283, 76.8394, 'exact'),
('loc-alamelu-avenue', 'Tamil Nadu', 'Erode', 'Gobichettipalayam', 'Alamelu Avenue', '638452', 'Alamelu Avenue Gobichettipalayam, Erode', 11.4532, 77.4385, 'exact'),
('loc-iswarya-garden', 'Tamil Nadu', 'Coimbatore', 'Periyanaickenpalayam', 'Iswarya Garden', '641020', 'Iswarya Garden, Periyanaickenpalayam, Coimbatore', 11.1394, 76.9345, 'exact'),
('loc-balaji-annanagar', 'Tamil Nadu', 'Coimbatore', 'Anna Nagar', 'Balaji Garden', '641020', 'Balaji Garden Phase II, Anna Nagar, Periyanaickenpalayam, Coimbatore', 11.1322, 76.9402, 'exact'),
('loc-adithi-enclave', 'Tamil Nadu', 'Coimbatore', 'Chinnavedampatti', 'Adithi Enclave', '641049', 'Adithi Enclave, Chinnavedampatti, Coimbatore', 11.0694, 76.9882, 'exact'),
('loc-aara-enclave1', 'Tamil Nadu', 'Coimbatore', 'Kalapatti', 'Aara Enclave Phase 1', '641048', 'Aara Enclave Phase 1, Kalapatti, Coimbatore', 11.0621, 77.0392, 'exact'),
('loc-aara-enclave2', 'Tamil Nadu', 'Coimbatore', 'Kalapatti', 'Aara Enclave Phase 2', '641048', 'Aara Enclave Phase 2, Kalapatti, Coimbatore', 11.0633, 77.0401, 'exact'),
('loc-golden-samichettipalayam', 'Tamil Nadu', 'Coimbatore', 'Samichettipalayam', 'Sri Golden City', '641047', 'Sri Golden City Samichettipalayam, Coimbatore', 11.1092, 76.9521, 'exact'),
('loc-upcoming-coimbatore', 'Tamil Nadu', 'Coimbatore', 'Coimbatore City', 'Upcoming Plot', '641001', 'Upcoming Plot Layout, Coimbatore', 11.0168, 76.9558, 'exact'),
('loc-upcoming-periyanaickenpalayam1', 'Tamil Nadu', 'Coimbatore', 'Periyanaickenpalayam', 'Upcoming Plot 1', '641020', 'Upcoming Gated Plot Layout 1, Periyanaickenpalayam, Coimbatore', 11.1345, 76.9372, 'exact'),
('loc-upcoming-sulur', 'Tamil Nadu', 'Coimbatore', 'Sulur', 'Upcoming Plot', '641402', 'Upcoming Plot Layout, Sulur, Coimbatore', 11.0264, 77.1221, 'exact'),
('loc-upcoming-periyanaickenpalayam2', 'Tamil Nadu', 'Coimbatore', 'Periyanaickenpalayam', 'Upcoming Plot 2', '641020', 'Upcoming Gated Plot Layout 2, Periyanaickenpalayam, Coimbatore', 11.1378, 76.9399, 'exact');

-- Seed real Listings (including status as published, featured, sold/completed, and pre-launch)
INSERT OR REPLACE INTO listings (id, slug, title, description, property_type, listing_purpose, status, price, area_sqft, plot_area_sqft, builtup_area_sqft, bedrooms, bathrooms, floors, parking_spaces, facing, furnished_status, featured, verified, agent_id, location_id, primary_image_url)
VALUES
(
  'listing-real-1',
  'aara-vista-kalapatti',
  'Aara Vista Premium Plots',
  'A premium residential gated community plot development located in Kalapatti, Coimbatore. Features premium concrete roads, streetlights, underground electricity lines, and 24/7 security. High-appreciating location with proximity to major IT hubs, schools, and hospitals.',
  'plot', 'sale', 'featured', 8500000, 2400, 2400, 0, 0, 0, 0, 0, 'East', 'Unfurnished', 1, 1, 'agent-1', 'loc-aara-vista',
  'https://propertyparadise.in/wp-content/uploads/2026/07/Gemini_Generated_Image_3scism3scism3sci.png'
),
(
  'listing-real-2',
  'kailash-nagar-periyanaickenpalayam',
  'Kailash Nagar Residential Plots',
  'Exclusive residential layout at Periyanaickenpalayam, Coimbatore. Gated community with clear legal titles, well-planned roads, underground storm water drains, and reliable drinking water connections.',
  'plot', 'sale', 'published', 5500000, 1800, 1800, 0, 0, 0, 0, 0, 'North-East', 'Unfurnished', 0, 1, 'agent-2', 'loc-kailash-nagar',
  'https://propertyparadise.in/wp-content/uploads/2026/05/Gemini_Generated_Image_cnq2fcnq2fcnq2fc-scaled.png'
),
(
  'listing-real-3',
  'balaji-garden-teachers-colony',
  'Balaji Garden Teachers Colony',
  'Elite residential plots situated in Teachers Colony, Coimbatore. Excellent connectivity to major transit routes, peaceful environment, and ready for immediate luxury villa construction.',
  'plot', 'sale', 'published', 6500000, 2000, 2000, 0, 0, 0, 0, 0, 'East', 'Unfurnished', 0, 1, 'agent-1', 'loc-balaji-garden',
  'https://propertyparadise.in/wp-content/uploads/2026/07/Gemini_Generated_Image_uz69qguz69qguz69-scaled.png'
),
(
  'listing-real-4',
  'sri-golden-city-bujanganur',
  'Sri Golden City Bujanganur',
  'Scenic, clear-title residential plots in Bujanganur, Coimbatore. Surrounded by lush nature with peaceful mountain views and easy accessibility from the main road corridor.',
  'plot', 'sale', 'published', 4500000, 1500, 1500, 0, 0, 0, 0, 0, 'South-East', 'Unfurnished', 0, 1, 'agent-2', 'loc-golden-bujanganur',
  'https://propertyparadise.in/wp-content/uploads/2026/07/Gemini_Generated_Image_m3jle5m3jle5m3jl-scaled.png'
),
(
  'listing-real-5',
  'sri-golden-city-annur',
  'Sri Golden City Annur',
  'DTCP approved high-growth residential plots in Annur, Coimbatore. Excellent road frontage, high commercial appreciation rate, and ready for home builders.',
  'plot', 'sale', 'published', 4800000, 1600, 1600, 0, 0, 0, 0, 0, 'East', 'Unfurnished', 0, 1, 'agent-1', 'loc-golden-annur',
  'https://propertyparadise.in/wp-content/uploads/2026/07/ChatGPT-Image-Jul-10-2026-01_29_51-PM-1.png'
),
(
  'listing-real-6',
  'aara-urbania-vellalore',
  'Aara Urbania Vellalore',
  'Modern infrastructure residential plot layout in Vellalore, Coimbatore. Complete with gated security entrance, clean paved blacktop roads, streetlights, and green park avenues.',
  'plot', 'sale', 'published', 6000000, 2200, 2200, 0, 0, 0, 0, 0, 'North', 'Unfurnished', 0, 1, 'agent-2', 'loc-aara-urbania',
  'https://propertyparadise.in/wp-content/uploads/2026/07/Gemini_Generated_Image_2187kv2187kv2187-1.png'
),
(
  'listing-real-7',
  'blue-diamond-bungalow-ooty',
  'Blue Diamond Bungalow Ooty',
  'A spectacular luxury colonial hilltop bungalow located in Fern Hill, Ooty. Fully furnished with vintage fireplaces, glass ceiling sunroom, and premium private lawn overlooking misty mountain valleys. Perfect legacy retreat.',
  'villa', 'sale', 'featured', 35000000, 4200, 15000, 4200, 4, 5, 2, 3, 'East', 'Fully Furnished', 1, 1, 'agent-1', 'loc-blue-diamond',
  'https://propertyparadise.in/wp-content/uploads/2026/06/Blue-Diamond-Bungalowkjjj-Sale.jpg'
),
(
  'listing-real-8',
  '56-acres-baraliyar-estate-ooty',
  '56 Acres Baraliyar Estate',
  'Generational land legacy of 56 acres located in Burliyar, Ooty. A massive private tea and coffee plantation estate complete with misty forest borders, a private resort pond, and high-value fruit orchards.',
  'plot', 'sale', 'published', 120000000, 2439360, 2439360, 0, 0, 0, 0, 0, 'South-East', 'Unfurnished', 0, 1, 'agent-2', 'loc-baraliyar',
  'https://propertyparadise.in/wp-content/uploads/2026/07/Vistas_of_green_forests_mountain_ranges_covered_in_fog_blue_skies_and_plantation_pond_and_lake_at_a_resort_in_ooty_edited-1.jpg'
),
(
  'listing-real-9',
  'alamelu-avenue-gobichettipalayam',
  'Alamelu Avenue Gobichettipalayam',
  'Premium residential layout at Gobichettipalayam, Erode. Surrounded by water canals and fertile agricultural views, providing a peaceful countryside lifestyle with urban convenience.',
  'plot', 'sale', 'published', 7500000, 2400, 2400, 0, 0, 0, 0, 0, 'North', 'Unfurnished', 0, 1, 'agent-1', 'loc-alamelu-avenue',
  'https://propertyparadise.in/wp-content/uploads/2026/07/Alamelu_Avenue_site_plot_2K_202607081639-2.jpeg'
),
(
  'listing-real-10',
  'iswarya-garden-periyanaickenpalayam',
  'Iswarya Garden (Completed)',
  'Successfully completed and delivered residential enclave at Periyanaickenpalayam, Coimbatore. Fully sold out to happy families.',
  'plot', 'sale', 'sold', 4200000, 1500, 1500, 0, 0, 0, 0, 0, 'East', 'Unfurnished', 0, 1, 'agent-2', 'loc-iswarya-garden',
  'https://propertyparadise.in/wp-content/uploads/2026/07/Gemini_Generated_Image_uxvzvkuxvzvkuxvz.png'
),
(
  'listing-real-11',
  'balaji-garden-anna-nagar-completed',
  'Balaji Garden - Anna Nagar (Completed)',
  'Gated community development at Anna Nagar, Periyanaickenpalayam. Features beautiful concrete arches, complete utility layouts, and plantation areas. 100% sold out.',
  'plot', 'sale', 'sold', 5000000, 1800, 1800, 0, 0, 0, 0, 0, 'East', 'Unfurnished', 0, 1, 'agent-1', 'loc-balaji-annanagar',
  'https://propertyparadise.in/wp-content/uploads/2026/05/DJI_0485.jpg-2-2-scaled.jpeg'
),
(
  'listing-real-12',
  'adithi-enclave-chinnavedampatti',
  'Adithi Enclave (Completed)',
  'Premium luxury plots in Chinnavedampatti, Coimbatore. 100% completed and handed over to buyers for villa construction. Fully sold out.',
  'plot', 'sale', 'sold', 5800000, 2000, 2000, 0, 0, 0, 0, 0, 'North', 'Unfurnished', 0, 1, 'agent-2', 'loc-adithi-enclave',
  'https://propertyparadise.in/wp-content/uploads/2026/07/Gemini_Generated_Image_v4q36ev4q36ev4q3-scaled.png'
),
(
  'listing-real-13',
  'aara-enclave-phase-1-kalapatti',
  'Aara Enclave Phase 1 (Completed)',
  'Finished premium residential plot community in Kalapatti, Coimbatore. 100% completed and handed over.',
  'plot', 'sale', 'sold', 7200000, 2400, 2400, 0, 0, 0, 0, 0, 'East', 'Unfurnished', 0, 1, 'agent-1', 'loc-aara-enclave1',
  'https://propertyparadise.in/wp-content/uploads/2026/07/18-min.jpg'
),
(
  'listing-real-14',
  'aara-enclave-phase-2-kalapatti',
  'Aara Enclave Phase 2 (Completed)',
  'Finished phase 2 premium residential plot community in Kalapatti, Coimbatore. Fully sold out.',
  'plot', 'sale', 'sold', 7800000, 2400, 2400, 0, 0, 0, 0, 0, 'East', 'Unfurnished', 0, 1, 'agent-1', 'loc-aara-enclave2',
  'https://propertyparadise.in/wp-content/uploads/2026/07/Gemini_Generated_Image_q7kzcgq7kzcgq7kz-scaled.png'
),
(
  'listing-real-15',
  'sri-golden-city-samichettipalayam',
  'Sri Golden City (Completed)',
  'Completed plot layout project at Samichettipalayam, Coimbatore. Fully delivered and registered.',
  'plot', 'sale', 'sold', 3800000, 1200, 1200, 0, 0, 0, 0, 0, 'North-East', 'Unfurnished', 0, 1, 'agent-2', 'loc-golden-samichettipalayam',
  'https://propertyparadise.in/wp-content/uploads/2026/07/unnamed.webp'
),
(
  'listing-real-16',
  'upcoming-plots-coimbatore',
  'Upcoming Gated Plots - Coimbatore',
  'Upcoming premium residential community project near Coimbatore, Tamil Nadu. Pre-book your land choice now for early-bird pre-launch pricing.',
  'plot', 'sale', 'published', 4500000, 2000, 2000, 0, 0, 0, 0, 0, 'East', 'Unfurnished', 0, 1, 'agent-1', 'loc-upcoming-coimbatore',
  'https://propertyparadise.in/wp-content/uploads/2026/07/11.png'
),
(
  'listing-real-17',
  'upcoming-plots-periyanaickenpalayam-1',
  'Upcoming Plots - Periyanaickenpalayam',
  'Upcoming gated community plot layout in Periyanaickenpalayam, Coimbatore. Launching soon, express your interest early.',
  'plot', 'sale', 'published', 4200000, 1800, 1800, 0, 0, 0, 0, 0, 'East', 'Unfurnished', 0, 1, 'agent-2', 'loc-upcoming-periyanaickenpalayam1',
  'https://propertyparadise.in/wp-content/uploads/2026/07/12.png'
),
(
  'listing-real-18',
  'upcoming-plots-sulur',
  'Upcoming Plots - Sulur',
  'Upcoming premium plot development near Sulur, Coimbatore. Pre-launch booking starts shortly.',
  'plot', 'sale', 'published', 3500000, 1500, 1500, 0, 0, 0, 0, 0, 'North', 'Unfurnished', 0, 1, 'agent-1', 'loc-upcoming-sulur',
  'https://propertyparadise.in/wp-content/uploads/2026/07/10.png'
),
(
  'listing-real-19',
  'upcoming-plots-periyanaickenpalayam-2',
  'Upcoming Elite Layout - Periyanaickenpalayam',
  'Pre-launch phase of an elite gated plot community at Periyanaickenpalayam, Coimbatore. Registration opening soon.',
  'plot', 'sale', 'published', 4600000, 2000, 2000, 0, 0, 0, 0, 0, 'East', 'Unfurnished', 0, 1, 'agent-2', 'loc-upcoming-periyanaickenpalayam2',
  'https://propertyparadise.in/wp-content/uploads/2026/07/Periyanaickenpalayam-1.png'
);

-- Seed Images
INSERT OR REPLACE INTO listing_images (listing_id, url, alt, sort_order, is_primary)
VALUES
('listing-real-1', 'https://propertyparadise.in/wp-content/uploads/2026/07/Gemini_Generated_Image_3scism3scism3sci.png', 'Aara Vista Layout', 1, 1),
('listing-real-2', 'https://propertyparadise.in/wp-content/uploads/2026/05/Gemini_Generated_Image_cnq2fcnq2fcnq2fc-scaled.png', 'Kailash Nagar Plot view', 1, 1),
('listing-real-3', 'https://propertyparadise.in/wp-content/uploads/2026/07/Gemini_Generated_Image_uz69qguz69qguz69-scaled.png', 'Balaji Garden Layout', 1, 1),
('listing-real-4', 'https://propertyparadise.in/wp-content/uploads/2026/07/Gemini_Generated_Image_m3jle5m3jle5m3jl-scaled.png', 'Sri Golden City Bujanganur', 1, 1),
('listing-real-5', 'https://propertyparadise.in/wp-content/uploads/2026/07/ChatGPT-Image-Jul-10-2026-01_29_51-PM-1.png', 'Sri Golden City Annur', 1, 1),
('listing-real-6', 'https://propertyparadise.in/wp-content/uploads/2026/07/Gemini_Generated_Image_2187kv2187kv2187-1.png', 'Aara Urbania Vellalore', 1, 1),
('listing-real-7', 'https://propertyparadise.in/wp-content/uploads/2026/06/Blue-Diamond-Bungalowkjjj-Sale.jpg', 'Blue Diamond Exterior', 1, 1),
('listing-real-8', 'https://propertyparadise.in/wp-content/uploads/2026/07/Vistas_of_green_forests_mountain_ranges_covered_in_fog_blue_skies_and_plantation_pond_and_lake_at_a_resort_in_ooty_edited-1.jpg', 'Baraliyar Estate Tea Hills', 1, 1),
('listing-real-9', 'https://propertyparadise.in/wp-content/uploads/2026/07/Alamelu_Avenue_site_plot_2K_202607081639-2.jpeg', 'Alamelu Avenue Gobichettipalayam', 1, 1),
('listing-real-10', 'https://propertyparadise.in/wp-content/uploads/2026/07/Gemini_Generated_Image_uxvzvkuxvzvkuxvz.png', 'Iswarya Garden Completed', 1, 1),
('listing-real-11', 'https://propertyparadise.in/wp-content/uploads/2026/05/DJI_0485.jpg-2-2-scaled.jpeg', 'Balaji Garden Completed', 1, 1),
('listing-real-12', 'https://propertyparadise.in/wp-content/uploads/2026/07/Gemini_Generated_Image_v4q36ev4q36ev4q3-scaled.png', 'Adithi Enclave Completed', 1, 1),
('listing-real-13', 'https://propertyparadise.in/wp-content/uploads/2026/07/18-min.jpg', 'Aara Enclave Phase 1 Completed', 1, 1),
('listing-real-14', 'https://propertyparadise.in/wp-content/uploads/2026/07/Gemini_Generated_Image_q7kzcgq7kzcgq7kz-scaled.png', 'Aara Enclave Phase 2 Completed', 1, 1),
('listing-real-15', 'https://propertyparadise.in/wp-content/uploads/2026/07/unnamed.webp', 'Sri Golden City Completed', 1, 1),
('listing-real-16', 'https://propertyparadise.in/wp-content/uploads/2026/07/11.png', 'Upcoming Coimbatore Plots', 1, 1),
('listing-real-17', 'https://propertyparadise.in/wp-content/uploads/2026/07/12.png', 'Upcoming Periyanaickenpalayam Plots', 1, 1),
('listing-real-18', 'https://propertyparadise.in/wp-content/uploads/2026/07/10.png', 'Upcoming Sulur Plots', 1, 1),
('listing-real-19', 'https://propertyparadise.in/wp-content/uploads/2026/07/Periyanaickenpalayam-1.png', 'Upcoming Elite Periyanaickenpalayam Layout', 1, 1);
