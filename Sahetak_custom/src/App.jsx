import { BrowserRouter, Routes, Route } from "react-router-dom";

import { OrderProvider } from "./context/OrderContext";
import Products from "./pages/Products";
import CustomerInfo from "./pages/CustomerInfo";
import DeliveryInfo from "./pages/DeliveryInfo";
import Confirmation from "./pages/Confirmation";
import OrderSuccess from "./pages/OrderSuccess";
import TrackOrder from "./pages/TrackOrder";
import NotFound from "./pages/NotFound";

const App = () => (
  <BrowserRouter>
    <OrderProvider>
      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/informations" element={<CustomerInfo />} />
        <Route path="/livraison" element={<DeliveryInfo />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/success" element={<OrderSuccess />} />
        <Route path="/track" element={<TrackOrder />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </OrderProvider>
  </BrowserRouter>
);

export default App;
