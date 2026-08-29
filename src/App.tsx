import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search";
import PropertyDetails from "./pages/PropertyDetails";
import MapSearch from "./pages/MapSearch";
import Favorites from "./pages/Favorites";
import Bookings from "./pages/Bookings";
import About from "./pages/About";
import Contact from "./pages/Contact";

// Admin Portal Imports
import AdminLogin from "./pages/Admin/Login";
import AdminDashboard from "./pages/Admin/Dashboard";
import ListingsList from "./pages/Admin/ListingsList";
import ListingEditor from "./pages/Admin/ListingEditor";
import LeadsList from "./pages/Admin/LeadsList";
import BookingsList from "./pages/Admin/BookingsList";
import AgentsList from "./pages/Admin/AgentsList";
import ChatSupport from "./pages/Admin/ChatSupport";

// Public Auth Import
import AuthPage from "./pages/Auth/AuthPage";
import ChatWidget from "./components/common/ChatWidget";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Customer Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/properties" element={<Search />} />
        <Route path="/properties/sale" element={<Search initialPurpose="sale" />} />

        <Route path="/properties/villas" element={<Search initialType="villa" />} />
        <Route path="/properties/plots" element={<Search initialType="plot" />} />
        <Route path="/property/:slug" element={<PropertyDetails />} />
        <Route path="/map" element={<MapSearch />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/booking/:listingId" element={<Bookings />} />
        <Route path="/booking" element={<Bookings />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Public Auth Routes */}
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Console Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/listings" element={<ListingsList />} />
        <Route path="/admin/listings/new" element={<ListingEditor />} />
        <Route path="/admin/listings/:id/edit" element={<ListingEditor />} />
        <Route path="/admin/leads" element={<LeadsList />} />
        <Route path="/admin/bookings" element={<BookingsList />} />
        <Route path="/admin/agents" element={<AgentsList />} />
        <Route path="/admin/chat" element={<ChatSupport />} />
      </Routes>
      <ChatWidget />
    </BrowserRouter>
  );
}
