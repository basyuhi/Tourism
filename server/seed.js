require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Destination = require("./models/Destination");
const Listing = require("./models/Listing");

// Connect to the database
connectDB();

const seedData = async () => {
    try {
        // 1. Clear existing data (optional, but keeps things clean)
        await Destination.deleteMany({});
        await Listing.deleteMany({});
        console.log("Cleared existing data.");

        // 2. Define realistic data for Assam & Meghalaya
        const destinations = [
            {
                name: "Kaziranga National Park",
                state: "Assam",
                slug: "kaziranga",
                description: "A UNESCO World Heritage Site and home to the great one-horned rhinoceros.",
                pros: ["Amazing wildlife sightings", "Well-organized jeep and elephant safaris"],
                cons: ["Park closes during monsoon (May-Oct)", "Can get very crowded in peak season"],
                dos: ["Carry binoculars", "Book your safari permits in advance"],
                donts: ["Wear bright colors", "Make loud noises or step out of the vehicle"],
                bestTimeToVisit: "November to April",
                heroImage: "https://images.unsplash.com/photo-1535941339077-2dd1c7963098?auto=format&fit=crop&w=800&q=80"
            },
            {
                name: "Majuli River Island",
                state: "Assam",
                slug: "majuli",
                description: "The world's largest river island, known for its vibrant Neo-Vaishnavite culture and serene landscapes.",
                pros: ["Peaceful and offbeat", "Rich cultural heritage (Satras)", "Amazing sunsets over the Brahmaputra"],
                cons: ["Ferry connectivity can be erratic in bad weather", "Limited luxury accommodation"],
                dos: ["Visit a traditional Satra", "Try the local Mishing tribal cuisine (like Poita Bhat)"],
                donts: ["Forget to carry cash (ATMs are scarce)", "Litter the riverbanks"],
                bestTimeToVisit: "October to March",
                heroImage: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80"
            },
            {
                name: "Shillong",
                state: "Meghalaya",
                slug: "shillong",
                description: "The 'Scotland of the East', known for its rolling hills, pleasant climate, and vibrant music scene.",
                pros: ["Great weather year-round", "Excellent local food scene", "Proximity to waterfalls and lakes"],
                cons: ["Traffic congestion in the city center", "Can get chilly at night"],
                dos: ["Visit Ward's Lake and Shillong Peak", "Try local Khasi dishes like Jadoh"],
                donts: ["Litter (Meghalaya has strict anti-plastic rules)", "Drive rashly on the winding hill roads"],
                bestTimeToVisit: "September to May",
                heroImage: "https://images.unsplash.com/photo-1626621341424-130820348869?auto=format&fit=crop&w=800&q=80"
            }
        ];

        const listings = [
            {
                title: "Mishing Eco-Hut Homestay",
                category: "Homestay",
                state: "Assam",
                location: "Majuli",
                description: "Experience authentic Mishing culture in a traditional bamboo hut right by the Brahmaputra river.",
                ownerName: "Paban Doley",
                whatsappNumber: "919876543210",
                instagramLink: "https://instagram.com/majuli_homestay",
                priceRange: "₹1200 - ₹1500/night (includes meals)",
                isVerified: true,
                images: ["https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=800&q=80"]
            },
            {
                title: "Lakadong Turmeric Direct from Farm",
                category: "Artisan",
                state: "Meghalaya",
                location: "Jaintia Hills",
                description: "100% organic, high-curcumin Lakadong turmeric powder sourced directly from Khasi farmers.",
                ownerName: "Sengdor Kharshiing",
                whatsappNumber: "919998887776",
                instagramLink: "https://instagram.com/lakadong_fresh",
                priceRange: "₹300 per 100g",
                isVerified: true,
                images: ["https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80"]
            },
            {
                title: "Living Root Bridge Trek Guide",
                category: "Experience",
                state: "Meghalaya",
                location: "Cherrapunji / Dawki",
                description: "Guided 2-hour trek to the Double Decker Living Root Bridge with a local Khasi youth. Includes tea and snacks.",
                ownerName: "Kongor Singh",
                whatsappNumber: "919112223334",
                instagramLink: "",
                priceRange: "₹500 per person",
                isVerified: true,
                images: ["https://images.unsplash.com/photo-1596395819057-d3755d517c2a?auto=format&fit=crop&w=800&q=80"]
            }
        ];

        // 3. Insert the data into the database
        await Destination.insertMany(destinations);
        console.log("✅ Destinations seeded successfully!");

        await Listing.insertMany(listings);
        console.log("✅ Listings seeded successfully!");

        // 4. Disconnect and exit
        mongoose.connection.close();
        console.log("Database connection closed. Done!");
        process.exit(0);

    } catch (error) {
        console.error("❌ Error seeding database:", error);
        process.exit(1);
    }
};

// Run the function
seedData();