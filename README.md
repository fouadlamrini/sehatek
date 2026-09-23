
```
sehatek
├─ Sahetak_admin
│  ├─ .env
│  ├─ .env.example
│  ├─ dist
│  │  ├─ assets
│  │  │  ├─ index-BZFNA8mL.js
│  │  │  └─ index-C0cWu-D7.css
│  │  ├─ favicon.svg
│  │  ├─ icons.svg
│  │  └─ index.html
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  ├─ favicon.svg
│  │  └─ icons.svg
│  ├─ README.md
│  ├─ src
│  │  ├─ api
│  │  │  ├─ adminApi.js
│  │  │  ├─ authApi.js
│  │  │  ├─ axios.js
│  │  │  ├─ orderApi.js
│  │  │  ├─ packApi.js
│  │  │  ├─ productApi.js
│  │  │  ├─ promotionApi.js
│  │  │  ├─ settingsApi.js
│  │  │  └─ statisticsApi.js
│  │  ├─ App.jsx
│  │  ├─ assets
│  │  ├─ components
│  │  │  ├─ admins
│  │  │  ├─ dashboard
│  │  │  │  └─ StatCard.jsx
│  │  │  ├─ layout
│  │  │  │  ├─ AdminLayout.jsx
│  │  │  │  ├─ Logo.jsx
│  │  │  │  ├─ MobileSidebar.jsx
│  │  │  │  ├─ navigation.js
│  │  │  │  ├─ Sidebar.jsx
│  │  │  │  └─ Topbar.jsx
│  │  │  ├─ orders
│  │  │  │  ├─ OrderDetailsDrawer.jsx
│  │  │  │  └─ OrderStatusBadge.jsx
│  │  │  ├─ packs
│  │  │  │  ├─ PackDetailsDrawer.jsx
│  │  │  │  └─ PackFormModal.jsx
│  │  │  ├─ products
│  │  │  │  ├─ MealDaysSelector.jsx
│  │  │  │  └─ ProductFormModal.jsx
│  │  │  ├─ promotions
│  │  │  │  └─ PromotionFormModal.jsx
│  │  │  └─ ui
│  │  │     ├─ Badge.jsx
│  │  │     ├─ Button.jsx
│  │  │     ├─ Card.jsx
│  │  │     ├─ ConfirmDialog.jsx
│  │  │     ├─ Drawer.jsx
│  │  │     ├─ EmptyState.jsx
│  │  │     ├─ Input.jsx
│  │  │     ├─ Modal.jsx
│  │  │     ├─ PageHeader.jsx
│  │  │     ├─ Select.jsx
│  │  │     ├─ Spinner.jsx
│  │  │     ├─ Switch.jsx
│  │  │     ├─ Table.jsx
│  │  │     ├─ Textarea.jsx
│  │  │     └─ Toast.jsx
│  │  ├─ constants
│  │  │  └─ index.js
│  │  ├─ context
│  │  │  ├─ AuthContext.jsx
│  │  │  └─ ToastContext.jsx
│  │  ├─ hooks
│  │  │  ├─ useAuth.js
│  │  │  └─ useToast.js
│  │  ├─ index.css
│  │  ├─ main.jsx
│  │  ├─ pages
│  │  │  ├─ admins
│  │  │  │  ├─ Admins.jsx
│  │  │  │  └─ CreateAdmin.jsx
│  │  │  ├─ auth
│  │  │  │  └─ Login.jsx
│  │  │  ├─ dashboard
│  │  │  │  └─ Dashboard.jsx
│  │  │  ├─ NotFound.jsx
│  │  │  ├─ orders
│  │  │  │  └─ Orders.jsx
│  │  │  ├─ packs
│  │  │  │  └─ Packs.jsx
│  │  │  ├─ products
│  │  │  │  └─ Products.jsx
│  │  │  ├─ profile
│  │  │  │  └─ Profile.jsx
│  │  │  ├─ promotions
│  │  │  │  └─ Promotions.jsx
│  │  │  └─ settings
│  │  │     └─ Settings.jsx
│  │  ├─ routes
│  │  │  ├─ AppRoutes.jsx
│  │  │  ├─ ProtectedRoute.jsx
│  │  │  └─ RoleRoute.jsx
│  │  └─ utils
│  │     ├─ cn.js
│  │     ├─ error.js
│  │     ├─ format.js
│  │     ├─ pack.js
│  │     └─ tokenStorage.js
│  └─ vite.config.js
├─ Sahetak_Api
│  ├─ .env
│  ├─ .env.example
│  ├─ logs
│  │  ├─ combined.log
│  │  └─ error.log
│  ├─ package-lock.json
│  ├─ package.json
│  └─ src
│     ├─ app.js
│     ├─ config
│     │  ├─ cloudinary.js
│     │  ├─ corsOptions.js
│     │  ├─ db.js
│     │  └─ logger.js
│     ├─ controllers
│     │  ├─ adminController.js
│     │  ├─ authController.js
│     │  ├─ orderController.js
│     │  ├─ packController.js
│     │  ├─ pricingController.js
│     │  ├─ productController.js
│     │  ├─ promotionController.js
│     │  ├─ settingsController.js
│     │  └─ statisticsController.js
│     ├─ middleware
│     │  ├─ authMiddleware.js
│     │  ├─ errorMiddleware.js
│     │  ├─ rateLimitMiddleware.js
│     │  ├─ requestLogger.js
│     │  ├─ roleMiddleware.js
│     │  ├─ uploadMiddleware.js
│     │  └─ validationMiddleware.js
│     ├─ models
│     │  ├─ Admin.js
│     │  ├─ BlacklistedToken.js
│     │  ├─ Customer.js
│     │  ├─ Delivery.js
│     │  ├─ Order.js
│     │  ├─ OrderItem.js
│     │  ├─ Pack.js
│     │  ├─ Product.js
│     │  ├─ Promotion.js
│     │  ├─ RefreshToken.js
│     │  └─ Settings.js
│     ├─ routes
│     │  ├─ adminRoutes.js
│     │  ├─ authRoutes.js
│     │  ├─ orderRoutes.js
│     │  ├─ packRoutes.js
│     │  ├─ pricingRoutes.js
│     │  ├─ productRoutes.js
│     │  ├─ promotionRoutes.js
│     │  ├─ settingsRoutes.js
│     │  └─ statisticsRoutes.js
│     ├─ seedAdmin.js
│     ├─ server.js
│     ├─ uploads
│     │  └─ products
│     │     ├─ 1789657171220-930885814.png
│     │     ├─ 1789657357300-755830530.png
│     │     └─ 1789657903337-287118397.png
│     ├─ utils
│     │  ├─ AppError.js
│     │  ├─ cloudinaryService.js
│     │  ├─ generateToken.js
│     │  └─ pricingService.js
│     └─ validators
│        ├─ adminValidator.js
│        ├─ authValidator.js
│        ├─ orderValidator.js
│        ├─ packValidator.js
│        ├─ pricingValidator.js
│        ├─ productValidator.js
│        └─ promotionValidator.js
└─ Sahetak_custom
   ├─ .env
   ├─ .env.example
   ├─ dist
   │  ├─ assets
   │  │  ├─ image1-BPTD_61c.jpeg
   │  │  ├─ image10-wNaBKnHf.jpeg
   │  │  ├─ image11-CzChICRN.jpeg
   │  │  ├─ image12-ZauX3VU7.jpeg
   │  │  ├─ image13-GdbIqdRQ.jpeg
   │  │  ├─ image14-x1i6gJzi.jpeg
   │  │  ├─ image15-HUj-jwAf.jpeg
   │  │  ├─ image16-CSaOk59j.jpeg
   │  │  ├─ image17-D2jNkQDt.jpeg
   │  │  ├─ image18-Dypqd8GH.jpeg
   │  │  ├─ image19-DZAXoGc1.jpeg
   │  │  ├─ image2-DMsYnH6O.jpeg
   │  │  ├─ image20-DHYq64nL.jpeg
   │  │  ├─ image21-DnY8_0mo.jpeg
   │  │  ├─ image22-BhTx8A_-.jpeg
   │  │  ├─ image23-CEuytC6M.jpeg
   │  │  ├─ image24-VgbPXN_X.jpeg
   │  │  ├─ image25-DoKV_3A9.jpeg
   │  │  ├─ image26-MMCbWrrE.jpeg
   │  │  ├─ image27-DzxM-8yR.jpeg
   │  │  ├─ image28-DozKpjvZ.jpeg
   │  │  ├─ image29-CFsGyHRK.jpeg
   │  │  ├─ image3-B5V7iUXr.jpeg
   │  │  ├─ image30-DGC13fYX.jpeg
   │  │  ├─ image31-BLyKPEVr.jpeg
   │  │  ├─ image32-BUAqv4bw.jpeg
   │  │  ├─ image33-BShWbWhi.jpeg
   │  │  ├─ image34-LZBbnLNn.jpeg
   │  │  ├─ image35-CQ_eKDlT.jpeg
   │  │  ├─ image36-D_Cd-CZV.jpeg
   │  │  ├─ image4-cD-sFgc8.jpeg
   │  │  ├─ image5-Xihe_eCa.jpeg
   │  │  ├─ image6-BcAiW3b9.jpeg
   │  │  ├─ image7-CFiI_ycW.jpeg
   │  │  ├─ image8-C5qD0JJx.jpeg
   │  │  ├─ image9-Do8lyNwy.jpeg
   │  │  ├─ index-DXW9Yvoa.js
   │  │  ├─ index-GLo0hnUS.css
   │  │  ├─ plats-CROdKWzr.jpeg
   │  │  └─ sahetak-BipmWyCZ.png
   │  ├─ favicon.svg
   │  ├─ icons.svg
   │  └─ index.html
   ├─ eslint.config.js
   ├─ index.html
   ├─ package-lock.json
   ├─ package.json
   ├─ public
   │  ├─ favicon.svg
   │  └─ icons.svg
   ├─ README.md
   ├─ src
   │  ├─ api
   │  │  ├─ axios.js
   │  │  ├─ orderApi.js
   │  │  ├─ packApi.js
   │  │  ├─ pricingApi.js
   │  │  ├─ productApi.js
   │  │  ├─ promotionApi.js
   │  │  └─ settingsApi.js
   │  ├─ App.jsx
   │  ├─ assets
   │  │  ├─ brochette.jpg
   │  │  ├─ couscous.jpg
   │  │  ├─ kebda.jpg
   │  │  ├─ madfouna.jpg
   │  │  ├─ paela.jpg
   │  │  ├─ plats.jpeg
   │  │  ├─ poulet.jpg
   │  │  ├─ sahetak.jpeg
   │  │  ├─ sahetak.png
   │  │  └─ slide
   │  │     ├─ image1.jpeg
   │  │     ├─ image10.jpeg
   │  │     ├─ image11.jpeg
   │  │     ├─ image12.jpeg
   │  │     ├─ image13.jpeg
   │  │     ├─ image14.jpeg
   │  │     ├─ image15.jpeg
   │  │     ├─ image16.jpeg
   │  │     ├─ image17.jpeg
   │  │     ├─ image18.jpeg
   │  │     ├─ image19.jpeg
   │  │     ├─ image2.jpeg
   │  │     ├─ image20.jpeg
   │  │     ├─ image21.jpeg
   │  │     ├─ image22.jpeg
   │  │     ├─ image23.jpeg
   │  │     ├─ image24.jpeg
   │  │     ├─ image25.jpeg
   │  │     ├─ image26.jpeg
   │  │     ├─ image27.jpeg
   │  │     ├─ image28.jpeg
   │  │     ├─ image29.jpeg
   │  │     ├─ image3.jpeg
   │  │     ├─ image30.jpeg
   │  │     ├─ image31.jpeg
   │  │     ├─ image32.jpeg
   │  │     ├─ image33.jpeg
   │  │     ├─ image34.jpeg
   │  │     ├─ image35.jpeg
   │  │     ├─ image36.jpeg
   │  │     ├─ image4.jpeg
   │  │     ├─ image5.jpeg
   │  │     ├─ image6.jpeg
   │  │     ├─ image7.jpeg
   │  │     ├─ image8.jpeg
   │  │     └─ image9.jpeg
   │  ├─ components
   │  │  ├─ Header.jsx
   │  │  ├─ layout
   │  │  │  ├─ SiteHeader.jsx
   │  │  │  └─ StepLayout.jsx
   │  │  ├─ order
   │  │  │  ├─ OrderItem.jsx
   │  │  │  ├─ OrderProgress.jsx
   │  │  │  └─ OrderSummary.jsx
   │  │  ├─ packs
   │  │  │  ├─ PackCard.jsx
   │  │  │  └─ PackSection.jsx
   │  │  ├─ products
   │  │  │  ├─ ProductCard.jsx
   │  │  │  └─ ProductGrid.jsx
   │  │  ├─ Slide.jsx
   │  │  └─ ui
   │  │     ├─ Badge.jsx
   │  │     ├─ Button.jsx
   │  │     ├─ ImageLightbox.jsx
   │  │     ├─ Input.jsx
   │  │     ├─ QuantityStepper.jsx
   │  │     └─ Spinner.jsx
   │  ├─ constants.js
   │  ├─ context
   │  │  └─ OrderContext.jsx
   │  ├─ data
   │  │  └─ silde.js
   │  ├─ hooks
   │  │  ├─ useCartPricing.js
   │  │  └─ useSiteSettings.js
   │  ├─ index.css
   │  ├─ main.jsx
   │  ├─ pages
   │  │  ├─ Confirmation.jsx
   │  │  ├─ CustomerInfo.jsx
   │  │  ├─ DeliveryInfo.jsx
   │  │  ├─ NotFound.jsx
   │  │  ├─ OrderSuccess.jsx
   │  │  └─ Products.jsx
   │  └─ utils
   │     ├─ catalog.js
   │     ├─ cn.js
   │     ├─ error.js
   │     ├─ formatters.js
   │     ├─ pricing.js
   │     ├─ validation.js
   │     └─ whatsapp.js
   └─ vite.config.js

```