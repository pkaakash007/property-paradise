import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search";
import PropertyDetails from "./pages/PropertyDetails";
import MapSearch from "./pages/MapSearch";
import Favorites from "./pages/Favorites";
import UserProfile from "./pages/UserProfile";
import Bookings from "./pages/Bookings";

// Admin Portal Imports
import AdminLogin from "./pages/Admin/Login";
import AdminDashboard from "./pages/Admin/Dashboard";
import ListingsList from "./pages/Admin/ListingsList";
import ListingEditor from "./pages/Admin/ListingEditor";
import LeadsList from "./pages/Admin/LeadsList";
import BookingsList from "./pages/Admin/BookingsList";
import AgentsList from "./pages/Admin/AgentsList";
import AnalyticsView from "./pages/Admin/AnalyticsView";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/properties" element={<Search />} />
        <Route path="/properties/sale" element={<Search initialPurpose="sale" />} />
        <Route path="/properties/rent" element={<Search initialPurpose="rent" />} />
        <Route path="/properties/villas" element={<Search initialType="villa" />} />
        <Route path="/properties/plots" element={<Search initialType="plot" />} />
        <Route path="/property/:slug" element={<PropertyDetails />} />
        <Route path="/map" element={<MapSearch />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/booking/:listingId" element={<Bookings />} />
        <Route path="/booking" element={<Bookings />} />

        {/* Admin Portal Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/listings" element={<ListingsList />} />
        <Route path="/admin/listings/new" element={<ListingEditor />} />
        <Route path="/admin/listings/:id/edit" element={<ListingEditor />} />
        <Route path="/admin/leads" element={<LeadsList />} />
        <Route path="/admin/bookings" element={<BookingsList />} />
        <Route path="/admin/agents" element={<AgentsList />} />
        <Route path="/admin/analytics" element={<AnalyticsView />} />
      </Routes>
    </BrowserRouter>
  );
}
