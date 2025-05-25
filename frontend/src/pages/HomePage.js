import React, { useState, useEffect } from "react";
import { ImSpinner8 } from "react-icons/im";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  FaPaw,
  FaCalendarAlt,
  FaCreditCard,
  FaBell,
  FaPhone,
  FaUserNurse,
  FaShoppingCart,
  FaUsers,
  FaCut,
  FaGraduationCap,
  FaSyringe,
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaChevronLeft,
  FaChevronRight,
  FaVideo,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const carouselImages = [
  "https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80",
  "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba",
  "https://images.unsplash.com/photo-1552053831-71594a27632d",
  "https://images.unsplash.com/photo-1583337130417-3346a1be7dee",
];

const AnimatedSection = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    {children}
  </motion.div>
);

const Homepage = () => {
  const [featuredPets, setFeaturedPets] = useState([]);
  const [caregivers, setCaregivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [petsRes, caregiversRes] = await Promise.all([
          axios.get("/api/pets"),
          axios.get("/api/caregivers"),
        ]);
        setFeaturedPets(petsRes.data);
        setCaregivers(caregiversRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const [heroRef, heroInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ImSpinner8 className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Dark Mode Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="fixed top-3 right-4 p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg z-50"
      >
        {darkMode ? "🌞" : "🌙"}
      </button>

      {/* Hero Carousel Section */}
      <section className="relative h-screen overflow-hidden">
        <AnimatePresence initial={false}>
          <motion.div
            key={carouselIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <img
              src={carouselImages[carouselIndex]}
              alt={`Carousel ${carouselIndex + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/40" />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 h-full flex items-center justify-center text-center">
          <div className="max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-white"
            >
              Premium Care for Your
              <br className="hidden md:block" /> Furry Friends
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl mb-8 text-gray-200"
            >
              Daycare, boarding, grooming, and more - all in one place
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <Link to="/book-now">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold text-lg flex items-center gap-3 shadow-lg"
                >
                  <FaPaw className="text-xl" /> Book Now
                </motion.button>
              </Link>
              <Link to="/caregiverpage">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg flex items-center gap-3 text-white"
                >
                  <FaUserNurse className="text-xl" /> Find Caregiver
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Carousel Controls */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-10">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCarouselIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === carouselIndex ? "bg-white" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={() =>
            setCarouselIndex((prev) =>
              prev === 0 ? carouselImages.length - 1 : prev - 1
            )
          }
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-3 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
        >
          <FaChevronLeft className="text-2xl" />
        </button>
        <button
          onClick={() =>
            setCarouselIndex((prev) => (prev + 1) % carouselImages.length)
          }
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-3 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
        >
          <FaChevronRight className="text-2xl" />
        </button>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection delay={0.2}>
            <h2
              className={`text-4xl font-bold text-center mb-16 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Our Services
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: FaPaw, title: "Pet Profiles", link: "/pets/register" },
              {
                icon: FaCalendarAlt,
                title: "Booking System",
                link: "/book-now",
              },
              { icon: FaShoppingCart, title: "Pet Shop", link: "/shop" },
              { icon: FaVideo, title: "Training Videos", link: "/training" },
              {
                icon: FaPhone,
                title: "Emergency Contact",
                link: "/emergencyContact",
              },
              {
                icon: FaUserNurse,
                title: "Verified Caregivers",
                link: "/caregiverpage",
              },
            ].map((feature, idx) => (
              <AnimatedSection key={feature.title} delay={0.3 + idx * 0.1}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className={`p-8 rounded-2xl transition-all ${
                    darkMode
                      ? "bg-gray-800 hover:bg-gray-700"
                      : "bg-white hover:bg-gray-50"
                  } shadow-xl`}
                >
                  <Link to={feature.link || "#"} className="block">
                    <div
                      className={`mb-6 ${
                        darkMode ? "text-blue-400" : "text-blue-600"
                      }`}
                    >
                      <feature.icon className="text-5xl" />
                    </div>
                    <h3
                      className={`text-2xl font-bold mb-4 ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {feature.title}
                    </h3>
                    <p
                      className={`${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {/* {feature.description || 'Lorem ipsum dolor sit amet consectetur adipisicing elit.'} */}
                    </p>
                  </Link>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Pets Carousel */}

      <section className="relative py-20 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba"
            alt="Pets background"
            className="w-full h-full object-cover object-center"
            loading="lazy"
          />
          <div
            className={`absolute inset-0 ${
              darkMode ? "bg-black/60" : "bg-white/80"
            }`}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex justify-between items-center mb-12">
            <h2
              className={`text-4xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Featured Pets
            </h2>
            <Link
              to="/pets"
              className={`flex items-center gap-2 ${
                darkMode
                  ? "text-blue-400 hover:text-blue-300"
                  : "text-blue-600 hover:text-blue-800"
              } transition-colors`}
            >
              View All <FaChevronRight className="text-sm" />
            </Link>
          </div>

          {/* Pet Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredPets.slice(0, 3).map((pet) => (
              <motion.div
                key={pet.id}
                whileHover={{ y: -5 }}
                className={`flex flex-col rounded-2xl overflow-hidden shadow-xl backdrop-blur-sm ${
                  darkMode ? "bg-gray-800/90" : "bg-white/90"
                }`}
              >
                <div className="relative h-64 group overflow-hidden">
                  <img
                    src={
                      pet.image ||
                      "https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    }
                    alt={pet.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                    <div>
                      <h3 className="text-2xl font-bold text-white">
                        {pet.name}
                      </h3>
                      <p className="text-gray-200">{pet.breed}</p>
                    </div>
                  </div>
                </div>

                <div
                  className={`p-6 flex-grow ${
                    darkMode ? "text-gray-100" : "text-gray-800"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        darkMode
                          ? "bg-gray-700 text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {pet.age} years
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        darkMode
                          ? "bg-gray-700 text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {pet.gender}
                    </span>
                  </div>

                  <p className="line-clamp-2 mb-4">
                    {pet.description ||
                      "Friendly and playful companion looking for love!"}
                  </p>

                  <div className="flex justify-between items-center mt-auto">
                    <Link
                      to={`/pets/${pet.id}`}
                      className={`flex items-center gap-2 ${
                        darkMode
                          ? "text-blue-400 hover:text-blue-300"
                          : "text-blue-600 hover:text-blue-800"
                      } transition-colors`}
                    >
                      <FaPaw /> View Profile
                    </Link>
                    <span
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {pet.location}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* "View More" Card */}
            <Link
              to="/pets"
              className={`flex flex-col items-center justify-center rounded-2xl backdrop-blur-sm ${
                darkMode
                  ? "bg-gray-800/90 hover:bg-gray-700/90"
                  : "bg-white/90 hover:bg-gray-50/90"
              } shadow-xl transition-all p-8`}
            >
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${
                  darkMode
                    ? "bg-gray-700 text-blue-400"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                <FaPaw className="text-3xl" />
              </div>
              <h3
                className={`text-2xl font-bold mb-2 text-center ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Meet Your Pets
              </h3>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-lg font-medium ${
                  darkMode
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                } transition-colors`}
              >
                Browse All
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* Caregivers Section  */}

      <section
        className={`py-20 px-4 sm:px-6 lg:px-8 ${
          darkMode ? "bg-gray-800/30" : "bg-gray-50"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2
              className={`text-4xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Trusted Caregivers
            </h2>
            <Link
              to="/caregiverpage"
              className={`flex items-center gap-2 ${
                darkMode
                  ? "text-blue-400 hover:text-blue-300"
                  : "text-blue-600 hover:text-blue-800"
              } transition-colors`}
            >
              View All <FaChevronRight className="text-sm" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {caregivers.slice(0, 3).map((caregiver) => (
              <motion.div
                key={caregiver.id}
                whileHover={{ y: -5 }}
                className={`rounded-2xl overflow-hidden shadow-xl ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <div className="relative group">
                  <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    {caregiver.profileImage ? (
                      <img
                        src={caregiver.profileImage}
                        alt={caregiver.name}
                        className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-white text-blue-600 flex items-center justify-center text-5xl font-bold shadow-lg">
                        {caregiver.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <Link
                      to={`/caregiverpage/${caregiver.id}`}
                      className={`w-full text-center py-2 rounded-lg font-medium ${
                        darkMode
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-white hover:bg-gray-100"
                      } transition-colors`}
                    >
                      View Profile
                    </Link>
                  </div>
                </div>

                <div className="p-6 text-center">
                  <h3
                    className={`text-xl font-bold mb-1 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {caregiver.name}
                  </h3>
                  <p
                    className={`text-sm mb-3 ${
                      darkMode ? "text-blue-400" : "text-blue-600"
                    }`}
                  >
                    {caregiver.specialty}
                  </p>

                  <div className="flex justify-center items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <FaPaw
                        key={i}
                        className={`text-sm ${
                          i < caregiver.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span
                      className={`ml-2 text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      ({caregiver.reviews}+)
                    </span>
                  </div>

                  <div
                    className={`flex flex-wrap justify-center gap-2 mt-4 ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {caregiver.services?.slice(0, 3).map((service) => (
                      <span
                        key={service}
                        className={`px-2 py-1 rounded-full text-xs ${
                          darkMode ? "bg-gray-700" : "bg-gray-100"
                        }`}
                      >
                        {service}
                      </span>
                    ))}
                    {caregiver.services?.length > 3 && (
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          darkMode ? "bg-gray-700" : "bg-gray-100"
                        }`}
                      >
                        +{caregiver.services.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* "View More" Card */}
            <Link
              to="/caregiverpage"
              className={`flex flex-col items-center justify-center rounded-2xl ${
                darkMode
                  ? "bg-gray-800 hover:bg-gray-700"
                  : "bg-white hover:bg-gray-50"
              } shadow-xl transition-all p-8`}
            >
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${
                  darkMode
                    ? "bg-gray-700 text-blue-400"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                <FaUserNurse className="text-3xl" />
              </div>
              <h3
                className={`text-2xl font-bold mb-2 text-center ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Meet Our Team
              </h3>
              <p
                className={`text-center mb-6 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Browse our complete list of certified caregivers
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-lg font-medium ${
                  darkMode
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                } transition-colors`}
              >
                View All Caregivers
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer
        className={`${
          darkMode ? "bg-gray-800" : "bg-gray-900"
        } text-white py-16`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-2xl font-bold">
              <FaPaw /> PetCare
            </div>
            <p className="text-gray-400">
              Revolutionizing pet care through technology and compassion.
            </p>
            <div className="flex gap-4">
              <FaInstagram className="cursor-pointer hover:text-pink-500 transition-colors" />
              <FaFacebook className="cursor-pointer hover:text-blue-500 transition-colors" />
              <FaTwitter className="cursor-pointer hover:text-blue-400 transition-colors" />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Services</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Premium Boarding</li>
              <li>Mobile Grooming</li>
              <li>Training Programs</li>
              <li>Health Plans</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li>About Us</li>
              <li>Careers</li>
              <li>Blog</li>
              <li>Partners</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Newsletter</h4>
            <div className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
          <p>© {new Date().getFullYear()} PetCare. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
