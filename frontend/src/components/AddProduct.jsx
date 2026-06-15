import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AddProduct = () => {
    const navigate = useNavigate();
    
    const templates = {
        'Electronics': {
            'Mobiles': ['RAM', 'Storage', 'Processor', 'Battery', 'Camera', 'Display Size', 'OS', 'Color', 'Warranty'],
            'Laptops': ['Processor', 'RAM', 'SSD/HDD', 'GPU', 'Display', 'Battery', 'Weight', 'Warranty'],
            'Headphones': ['Type', 'Connectivity', 'Battery Life', 'Noise Cancellation', 'Color'],
            'Smart Watches': ['Display', 'Battery', 'Sensors', 'Water Resistance', 'Strap Material']
        },
        'Fashion': {
            'Men\'s Clothing': ['Size', 'Fabric', 'Fit', 'Color', 'Care Instructions'],
            'Women\'s Clothing': ['Size', 'Fabric', 'Style', 'Color', 'Occasion'],
            'Shoes': ['Size', 'Material', 'Sole', 'Color', 'Style']
        },
        'Beauty & Cosmetics': {
            'Face Wash': ['Skin Type', 'Volume', 'Key Ingredients', 'Benefits'],
            'Makeup': ['Shade', 'Skin Type', 'Finish', 'Expiry Date']
        }
    };

    // Deeply expanded dummy data with 8 strictly unique items per category and verified images
    const dummyData = {
        'Mobiles': [
            { name: 'Galaxy S23', brand: 'Samsung', price: '899.99', countInStock: '50', imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=800&auto=format&fit=crop', attributes: { 'RAM': '12GB', 'Storage': '256GB', 'Processor': 'Snapdragon 8 Gen 2', 'Battery': '5000mAh', 'Camera': '108MP', 'Display Size': '6.8"', 'OS': 'Android 14', 'Color': 'Phantom Black', 'Warranty': '1 Year' } },
            { name: 'Pixel 8 Pro', brand: 'Google', price: '899.00', countInStock: '80', imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=800&auto=format&fit=crop', attributes: { 'RAM': '12GB', 'Storage': '256GB', 'Processor': 'Tensor G3', 'Battery': '5050mAh', 'Camera': '50MP', 'Display Size': '6.7"', 'OS': 'Android 14', 'Color': 'Obsidian', 'Warranty': '1 Year' } },
            { name: 'iPhone 15 Pro Max', brand: 'Apple', price: '1199.00', countInStock: '40', imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop', attributes: { 'RAM': '8GB', 'Storage': '512GB', 'Processor': 'A17 Pro', 'Battery': '4422mAh', 'Camera': '48MP', 'Display Size': '6.7"', 'OS': 'iOS 17', 'Color': 'Natural Titanium', 'Warranty': '1 Year' } },
            { name: 'OnePlus 12', brand: 'OnePlus', price: '799.00', countInStock: '100', imageUrl: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b0?q=80&w=800&auto=format&fit=crop', attributes: { 'RAM': '16GB', 'Storage': '512GB', 'Processor': 'Snapdragon 8 Gen 3', 'Battery': '5400mAh', 'Camera': '50MP', 'Display Size': '6.82"', 'OS': 'OxygenOS 14', 'Color': 'Flowy Emerald', 'Warranty': '1 Year' } },
            { name: 'Xiaomi 14 Ultra', brand: 'Xiaomi', price: '1099.00', countInStock: '60', imageUrl: 'https://images.unsplash.com/photo-1533228100845-08145b01de14?q=80&w=800&auto=format&fit=crop', attributes: { 'RAM': '16GB', 'Storage': '512GB', 'Processor': 'Snapdragon 8 Gen 3', 'Battery': '5300mAh', 'Camera': '50MP Quad', 'Display Size': '6.73"', 'OS': 'HyperOS', 'Color': 'White', 'Warranty': '1 Year' } },
            { name: 'Moto Edge 50 Pro', brand: 'Motorola', price: '699.00', countInStock: '85', imageUrl: 'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?q=80&w=800&auto=format&fit=crop', attributes: { 'RAM': '12GB', 'Storage': '256GB', 'Processor': 'Snapdragon 7 Gen 3', 'Battery': '4500mAh', 'Camera': '50MP', 'Display Size': '6.7"', 'OS': 'Android 14', 'Color': 'Luxe Lavender', 'Warranty': '1 Year' } },
            { name: 'Xperia 1 V', brand: 'Sony', price: '1399.00', countInStock: '30', imageUrl: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?q=80&w=800&auto=format&fit=crop', attributes: { 'RAM': '12GB', 'Storage': '256GB', 'Processor': 'Snapdragon 8 Gen 2', 'Battery': '5000mAh', 'Camera': '48MP', 'Display Size': '6.5" 4K', 'OS': 'Android 13', 'Color': 'Black', 'Warranty': '1 Year' } },
            { name: 'ROG Phone 8', brand: 'ASUS', price: '1099.00', countInStock: '45', imageUrl: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?q=80&w=800&auto=format&fit=crop', attributes: { 'RAM': '16GB', 'Storage': '512GB', 'Processor': 'Snapdragon 8 Gen 3', 'Battery': '5500mAh', 'Camera': '50MP', 'Display Size': '6.78" 165Hz', 'OS': 'Android 14', 'Color': 'Rebel Grey', 'Warranty': '1 Year' } }
        ],
        'Laptops': [
            { name: 'MacBook Air M3', brand: 'Apple', price: '1299.00', countInStock: '30', imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop', attributes: { 'Processor': 'Apple M3', 'RAM': '16GB', 'SSD/HDD': '512GB SSD', 'GPU': '10-core GPU', 'Display': '13.6"', 'Battery': '18 hours', 'Weight': '1.24 kg', 'Warranty': '1 Year' } },
            { name: 'XPS 15 Studio', brand: 'Dell', price: '1499.00', countInStock: '25', imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=800&auto=format&fit=crop', attributes: { 'Processor': 'Intel Core i7', 'RAM': '16GB', 'SSD/HDD': '1TB NVMe', 'GPU': 'RTX 4050', 'Display': '15.6" OLED', 'Battery': '86Wh', 'Weight': '1.92 kg', 'Warranty': '1 Year Premium' } },
            { name: 'ThinkPad X1 Carbon', brand: 'Lenovo', price: '1350.00', countInStock: '40', imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800&auto=format&fit=crop', attributes: { 'Processor': 'Intel Core i7', 'RAM': '16GB', 'SSD/HDD': '512GB NVMe', 'GPU': 'Iris Xe', 'Display': '14.0" IPS', 'Battery': '15 hours', 'Weight': '1.13 kg', 'Warranty': '3 Years On-site' } },
            { name: 'ROG Zephyrus G14', brand: 'ASUS', price: '1599.00', countInStock: '15', imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=800&auto=format&fit=crop', attributes: { 'Processor': 'AMD Ryzen 9', 'RAM': '32GB', 'SSD/HDD': '1TB SSD', 'GPU': 'RTX 4060', 'Display': '14.0" 120Hz', 'Battery': '76Wh', 'Weight': '1.65 kg', 'Warranty': '1 Year' } },
            { name: 'Spectre x360', brand: 'HP', price: '1249.00', countInStock: '55', imageUrl: 'https://images.unsplash.com/photo-1531297172868-9f1c1e405bd4?q=80&w=800&auto=format&fit=crop', attributes: { 'Processor': 'Intel Core Ultra 7', 'RAM': '16GB', 'SSD/HDD': '1TB NVMe', 'GPU': 'Intel Arc', 'Display': '14.0" OLED Touch', 'Battery': '14 hours', 'Weight': '1.44 kg', 'Warranty': '1 Year' } },
            { name: 'Surface Laptop 6', brand: 'Microsoft', price: '1199.00', countInStock: '45', imageUrl: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=800&auto=format&fit=crop', attributes: { 'Processor': 'Snapdragon X Elite', 'RAM': '16GB', 'SSD/HDD': '512GB SSD', 'GPU': 'Adreno', 'Display': '13.8" PixelSense', 'Battery': '20 hours', 'Weight': '1.34 kg', 'Warranty': '1 Year' } },
            { name: 'Blade 15', brand: 'Razer', price: '2299.00', countInStock: '20', imageUrl: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=800&auto=format&fit=crop', attributes: { 'Processor': 'Intel Core i9', 'RAM': '32GB', 'SSD/HDD': '1TB NVMe', 'GPU': 'RTX 4070', 'Display': '15.6" 240Hz', 'Battery': '80Wh', 'Weight': '2.01 kg', 'Warranty': '1 Year' } },
            { name: 'Swift X 14', brand: 'Acer', price: '999.00', countInStock: '70', imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop', attributes: { 'Processor': 'Intel Core i7', 'RAM': '16GB', 'SSD/HDD': '512GB SSD', 'GPU': 'RTX 3050', 'Display': '14.0" IPS', 'Battery': '12 hours', 'Weight': '1.55 kg', 'Warranty': '1 Year' } }
        ],
        'Headphones': [
            { name: 'WH-1000XM5', brand: 'Sony', price: '348.00', countInStock: '100', imageUrl: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=800&auto=format&fit=crop', attributes: { 'Type': 'Over-Ear', 'Connectivity': 'Bluetooth 5.2', 'Battery Life': '30 Hours', 'Noise Cancellation': 'Active ANC', 'Color': 'Silver' } },
            { name: 'QuietComfort Ultra', brand: 'Bose', price: '429.00', countInStock: '60', imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop', attributes: { 'Type': 'Over-Ear', 'Connectivity': 'Bluetooth 5.3', 'Battery Life': '24 Hours', 'Noise Cancellation': 'Ultra ANC', 'Color': 'Black' } },
            { name: 'AirPods Max', brand: 'Apple', price: '549.00', countInStock: '45', imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=800&auto=format&fit=crop', attributes: { 'Type': 'Over-Ear', 'Connectivity': 'Bluetooth 5.0', 'Battery Life': '20 Hours', 'Noise Cancellation': 'Active ANC', 'Color': 'Space Gray' } },
            { name: 'Momentum 4', brand: 'Sennheiser', price: '379.00', countInStock: '75', imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=800&auto=format&fit=crop', attributes: { 'Type': 'Over-Ear', 'Connectivity': 'Bluetooth 5.2', 'Battery Life': '60 Hours', 'Noise Cancellation': 'Adaptive ANC', 'Color': 'White' } },
            { name: 'Elite 85h', brand: 'Jabra', price: '249.00', countInStock: '90', imageUrl: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=800&auto=format&fit=crop', attributes: { 'Type': 'Over-Ear', 'Connectivity': 'Bluetooth 5.0', 'Battery Life': '36 Hours', 'Noise Cancellation': 'Smart ANC', 'Color': 'Titanium Black' } },
            { name: 'Studio Pro', brand: 'Beats', price: '349.00', countInStock: '110', imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426fa15d8?q=80&w=800&auto=format&fit=crop', attributes: { 'Type': 'Over-Ear', 'Connectivity': 'Bluetooth 5.3', 'Battery Life': '40 Hours', 'Noise Cancellation': 'Active ANC', 'Color': 'Deep Brown' } },
            { name: 'ATH-M50xBT2', brand: 'Audio-Technica', price: '199.00', countInStock: '150', imageUrl: 'https://images.unsplash.com/photo-1520170350707-b2da59970118?q=80&w=800&auto=format&fit=crop', attributes: { 'Type': 'Over-Ear', 'Connectivity': 'Bluetooth 5.0', 'Battery Life': '50 Hours', 'Noise Cancellation': 'Passive', 'Color': 'Black' } },
            { name: 'PX7 S2e', brand: 'Bowers & Wilkins', price: '399.00', countInStock: '40', imageUrl: 'https://images.unsplash.com/photo-1582310167232-a567674dc497?q=80&w=800&auto=format&fit=crop', attributes: { 'Type': 'Over-Ear', 'Connectivity': 'Bluetooth 5.2', 'Battery Life': '30 Hours', 'Noise Cancellation': 'Advanced ANC', 'Color': 'Ocean Blue' } }
        ],
        'Smart Watches': [
            { name: 'Watch Series 9', brand: 'Apple', price: '399.00', countInStock: '45', imageUrl: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?q=80&w=800&auto=format&fit=crop', attributes: { 'Display': 'Always-On Retina', 'Battery': '18 Hours', 'Sensors': 'ECG, Blood Oxygen', 'Water Resistance': '50m', 'Strap Material': 'Sport Band' } },
            { name: 'Galaxy Watch 6', brand: 'Samsung', price: '299.00', countInStock: '70', imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=800&auto=format&fit=crop', attributes: { 'Display': 'Super AMOLED', 'Battery': '40 Hours', 'Sensors': 'BIA, Heart Rate', 'Water Resistance': '5ATM', 'Strap Material': 'Silicone' } },
            { name: 'Forerunner 265', brand: 'Garmin', price: '450.00', countInStock: '30', imageUrl: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=800&auto=format&fit=crop', attributes: { 'Display': 'AMOLED', 'Battery': '13 Days', 'Sensors': 'Advanced GPS, Heart Rate', 'Water Resistance': '5ATM', 'Strap Material': 'Silicone' } },
            { name: 'Pixel Watch 2', brand: 'Google', price: '349.00', countInStock: '55', imageUrl: 'https://images.unsplash.com/photo-1617043786394-f977fa12eddf?q=80&w=800&auto=format&fit=crop', attributes: { 'Display': 'AMOLED', 'Battery': '24 Hours', 'Sensors': 'cEDA, Heart Rate', 'Water Resistance': '50m', 'Strap Material': 'Fluoroelastomer' } },
            { name: 'Versa 4', brand: 'Fitbit', price: '199.00', countInStock: '120', imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop', attributes: { 'Display': 'AMOLED', 'Battery': '6 Days', 'Sensors': 'Heart Rate, SpO2', 'Water Resistance': '50m', 'Strap Material': 'Classic Band' } },
            { name: 'Venu 3', brand: 'Garmin', price: '449.00', countInStock: '40', imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=800&auto=format&fit=crop', attributes: { 'Display': 'AMOLED', 'Battery': '14 Days', 'Sensors': 'ECG, Sleep Coach', 'Water Resistance': '5ATM', 'Strap Material': 'Silicone' } },
            { name: 'TicWatch Pro 5', brand: 'Mobvoi', price: '349.00', countInStock: '50', imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=800&auto=format&fit=crop', attributes: { 'Display': 'Dual Display', 'Battery': '80 Hours', 'Sensors': 'Heart Rate, Barometer', 'Water Resistance': '5ATM', 'Strap Material': 'Silicone' } },
            { name: 'Amazfit GTR 4', brand: 'Amazfit', price: '199.00', countInStock: '95', imageUrl: 'https://images.unsplash.com/photo-1461141346587-d858e4ad984c?q=80&w=800&auto=format&fit=crop', attributes: { 'Display': 'AMOLED', 'Battery': '14 Days', 'Sensors': 'BioTracker 4.0', 'Water Resistance': '5ATM', 'Strap Material': 'Fluoroelastomer' } }
        ],
        'Men\'s Clothing': [
            { name: 'Classic Oxford Shirt', brand: 'Ralph Lauren', price: '89.50', countInStock: '200', imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e32f85e23?q=80&w=800&auto=format&fit=crop', attributes: { 'Size': 'Large', 'Fabric': '100% Cotton', 'Fit': 'Regular Fit', 'Color': 'Light Blue', 'Care Instructions': 'Machine Wash Cold' } },
            { name: 'Slim Fit Chinos', brand: 'Levi\'s', price: '59.99', countInStock: '150', imageUrl: 'https://images.unsplash.com/photo-1473966968600-fa801b1c7c4c?q=80&w=800&auto=format&fit=crop', attributes: { 'Size': '32x32', 'Fabric': 'Cotton Twill', 'Fit': 'Slim', 'Color': 'Khaki', 'Care Instructions': 'Tumble Dry Low' } },
            { name: 'Leather Biker Jacket', brand: 'AllSaints', price: '350.00', countInStock: '40', imageUrl: 'https://images.unsplash.com/photo-1551028719-01c1eb5c8dd4?q=80&w=800&auto=format&fit=crop', attributes: { 'Size': 'Medium', 'Fabric': 'Genuine Leather', 'Fit': 'Slim Fit', 'Color': 'Black', 'Care Instructions': 'Dry Clean Only' } },
            { name: 'Denim Trucker Jacket', brand: 'Wrangler', price: '75.00', countInStock: '80', imageUrl: 'https://images.unsplash.com/photo-1495105718507-2c66d213904e?q=80&w=800&auto=format&fit=crop', attributes: { 'Size': 'Large', 'Fabric': 'Denim', 'Fit': 'Regular', 'Color': 'Blue', 'Care Instructions': 'Machine Wash' } },
            { name: 'Casual Graphic Tee', brand: 'Vans', price: '25.00', countInStock: '300', imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop', attributes: { 'Size': 'Medium', 'Fabric': 'Cotton', 'Fit': 'Relaxed', 'Color': 'White', 'Care Instructions': 'Tumble Dry Low' } },
            { name: 'Tailored Wool Suit', brand: 'Hugo Boss', price: '599.00', countInStock: '25', imageUrl: 'https://images.unsplash.com/photo-1617137952328-9d2c25390c5d?q=80&w=800&auto=format&fit=crop', attributes: { 'Size': '40R', 'Fabric': 'Virgin Wool', 'Fit': 'Slim Fit', 'Color': 'Navy', 'Care Instructions': 'Dry Clean Only' } },
            { name: 'Essential Pullover Hoodie', brand: 'Nike', price: '55.00', countInStock: '250', imageUrl: 'https://images.unsplash.com/photo-1507679815033-ec46162354a8?q=80&w=800&auto=format&fit=crop', attributes: { 'Size': 'Large', 'Fabric': 'Cotton Blend', 'Fit': 'Regular', 'Color': 'Grey Heather', 'Care Instructions': 'Machine Wash' } },
            { name: 'Cable Knit Sweater', brand: 'Tommy Hilfiger', price: '95.00', countInStock: '110', imageUrl: 'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?q=80&w=800&auto=format&fit=crop', attributes: { 'Size': 'Medium', 'Fabric': 'Cotton', 'Fit': 'Regular', 'Color': 'Cream', 'Care Instructions': 'Machine Wash Cold' } }
        ],
        'Women\'s Clothing': [
            { name: 'Floral Summer Maxi', brand: 'Zara', price: '59.90', countInStock: '150', imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop', attributes: { 'Size': 'Medium', 'Fabric': 'Viscose', 'Style': 'Maxi Dress', 'Color': 'Red/White Floral', 'Occasion': 'Casual / Summer' } },
            { name: 'Tailored Blazer', brand: 'H&M', price: '49.99', countInStock: '100', imageUrl: 'https://images.unsplash.com/photo-1548624149-f9b1859aa7d0?q=80&w=800&auto=format&fit=crop', attributes: { 'Size': 'Small', 'Fabric': 'Polyester', 'Style': 'Business Casual', 'Color': 'Navy Blue', 'Occasion': 'Workwear' } },
            { name: 'Silk Evening Gown', brand: 'Mango', price: '129.99', countInStock: '50', imageUrl: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=800&auto=format&fit=crop', attributes: { 'Size': 'Medium', 'Fabric': '100% Silk', 'Style': 'Elegant', 'Color': 'Emerald Green', 'Occasion': 'Evening / Formal' } },
            { name: 'Cozy Knit Sweater', brand: 'Everlane', price: '85.00', countInStock: '120', imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop', attributes: { 'Size': 'Large', 'Fabric': 'Merino Wool', 'Style': 'Cozy', 'Color': 'Cream', 'Occasion': 'Casual / Winter' } },
            { name: 'High-Waisted Jeans', brand: 'Madewell', price: '128.00', countInStock: '180', imageUrl: 'https://images.unsplash.com/photo-1503342394128-c104d54dba01?q=80&w=800&auto=format&fit=crop', attributes: { 'Size': '28', 'Fabric': 'Denim', 'Style': 'Vintage Straight', 'Color': 'Light Wash', 'Occasion': 'Everyday' } },
            { name: 'Pleated Midi Skirt', brand: 'Uniqlo', price: '39.90', countInStock: '140', imageUrl: 'https://images.unsplash.com/photo-1485230895920-ee9ac328f7af?q=80&w=800&auto=format&fit=crop', attributes: { 'Size': 'Medium', 'Fabric': 'Polyester Blend', 'Style': 'Midi', 'Color': 'Dusty Pink', 'Occasion': 'Work / Casual' } },
            { name: 'Wrap Dress', brand: 'Diane von Furstenberg', price: '298.00', countInStock: '45', imageUrl: 'https://images.unsplash.com/photo-1434389678369-e08b4cac3105?q=80&w=800&auto=format&fit=crop', attributes: { 'Size': '6', 'Fabric': 'Silk Jersey', 'Style': 'Wrap', 'Color': 'Black/White Print', 'Occasion': 'Versatile' } },
            { name: 'Trench Coat', brand: 'Burberry', price: '1250.00', countInStock: '15', imageUrl: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?q=80&w=800&auto=format&fit=crop', attributes: { 'Size': 'UK 10', 'Fabric': 'Gabardine', 'Style': 'Classic Trench', 'Color': 'Honey', 'Occasion': 'Outerwear' } }
        ],
        'Shoes': [
            { name: 'Air Force 1', brand: 'Nike', price: '110.00', countInStock: '80', imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop', attributes: { 'Size': 'US 10', 'Material': 'Leather', 'Sole': 'Rubber', 'Color': 'Red/White', 'Style': 'Sneaker' } },
            { name: 'Ultraboost Light', brand: 'Adidas', price: '190.00', countInStock: '50', imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ea6187bc0?q=80&w=800&auto=format&fit=crop', attributes: { 'Size': 'US 9.5', 'Material': 'Primeknit', 'Sole': 'Light Boost', 'Color': 'Cloud White', 'Style': 'Running' } },
            { name: 'Classic Leather Oxford', brand: 'Clarks', price: '120.00', countInStock: '60', imageUrl: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=800&auto=format&fit=crop', attributes: { 'Size': 'US 11', 'Material': 'Genuine Leather', 'Sole': 'Leather/Rubber', 'Color': 'Brown', 'Style': 'Formal / Dress' } },
            { name: 'Old Skool Canvas', brand: 'Vans', price: '65.00', countInStock: '200', imageUrl: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=800&auto=format&fit=crop', attributes: { 'Size': 'US 9', 'Material': 'Canvas/Suede', 'Sole': 'Waffle Rubber', 'Color': 'Black/White', 'Style': 'Skate' } },
            { name: 'Chuck Taylor All Star', brand: 'Converse', price: '60.00', countInStock: '250', imageUrl: 'https://images.unsplash.com/photo-1460353581641-378ea8ce9a49?q=80&w=800&auto=format&fit=crop', attributes: { 'Size': 'US 8', 'Material': 'Canvas', 'Sole': 'Rubber', 'Color': 'Optical White', 'Style': 'Casual' } },
            { name: 'Air Jordan 1 Retro', brand: 'Nike', price: '180.00', countInStock: '30', imageUrl: 'https://images.unsplash.com/photo-1560769680-ba6512eb2fc3?q=80&w=800&auto=format&fit=crop', attributes: { 'Size': 'US 10.5', 'Material': 'Premium Leather', 'Sole': 'Rubber', 'Color': 'Chicago', 'Style': 'Sneaker' } },
            { name: 'Gel-Kayano 30', brand: 'ASICS', price: '160.00', countInStock: '85', imageUrl: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=800&auto=format&fit=crop', attributes: { 'Size': 'US 9', 'Material': 'Engineered Mesh', 'Sole': 'FF BLAST', 'Color': 'Black/Glow', 'Style': 'Running' } },
            { name: '574 Core', brand: 'New Balance', price: '85.00', countInStock: '140', imageUrl: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=800&auto=format&fit=crop', attributes: { 'Size': 'US 10', 'Material': 'Suede/Mesh', 'Sole': 'ENCAP', 'Color': 'Green', 'Style': 'Lifestyle' } }
        ],
        'Face Wash': [
            { name: 'Hydrating Cleanser', brand: 'CeraVe', price: '15.99', countInStock: '300', imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=800&auto=format&fit=crop', attributes: { 'Skin Type': 'Normal to Dry', 'Volume': '16 oz', 'Key Ingredients': 'Ceramides', 'Benefits': 'Cleanses and Hydrates' } },
            { name: 'Salicylic Acid Wash', brand: 'Neutrogena', price: '9.49', countInStock: '250', imageUrl: 'https://images.unsplash.com/photo-1571781526291-c477eb311dc6?q=80&w=800&auto=format&fit=crop', attributes: { 'Skin Type': 'Oily', 'Volume': '9 oz', 'Key Ingredients': '2% Salicylic Acid', 'Benefits': 'Clears Breakouts' } },
            { name: 'Gentle Skin Cleanser', brand: 'Cetaphil', price: '13.50', countInStock: '400', imageUrl: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=800&auto=format&fit=crop', attributes: { 'Skin Type': 'Sensitive', 'Volume': '16 oz', 'Key Ingredients': 'Glycerin', 'Benefits': 'Non-irritating cleanse' } },
            { name: 'Foaming Facial Cleanser', brand: 'La Roche-Posay', price: '16.99', countInStock: '180', imageUrl: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=800&auto=format&fit=crop', attributes: { 'Skin Type': 'Oily/Sensitive', 'Volume': '13.5 oz', 'Key Ingredients': 'Niacinamide', 'Benefits': 'Removes excess oil' } },
            { name: 'Soy Face Cleanser', brand: 'Fresh', price: '39.00', countInStock: '120', imageUrl: 'https://images.unsplash.com/photo-1615397323194-be9090b848c1?q=80&w=800&auto=format&fit=crop', attributes: { 'Skin Type': 'All', 'Volume': '5 oz', 'Key Ingredients': 'Soy Proteins', 'Benefits': 'Removes Makeup safely' } },
            { name: 'Daily Microfoliant', brand: 'Dermalogica', price: '65.00', countInStock: '90', imageUrl: 'https://images.unsplash.com/photo-1596755389378-f60da3d6e50e?q=80&w=800&auto=format&fit=crop', attributes: { 'Skin Type': 'All', 'Volume': '2.6 oz', 'Key Ingredients': 'Papaya Enzymes', 'Benefits': 'Brightens Skin' } },
            { name: 'Squalane Cleanser', brand: 'The Ordinary', price: '9.00', countInStock: '350', imageUrl: 'https://images.unsplash.com/photo-1611077544520-227653a94833?q=80&w=800&auto=format&fit=crop', attributes: { 'Skin Type': 'Dry/Sensitive', 'Volume': '50 ml', 'Key Ingredients': 'Squalane', 'Benefits': 'Moisturizing Cleanse' } },
            { name: 'Kale + Green Tea Cleanser', brand: 'Youth to the People', price: '39.00', countInStock: '150', imageUrl: 'https://images.unsplash.com/photo-1580870059805-a4bf8c11e7df?q=80&w=800&auto=format&fit=crop', attributes: { 'Skin Type': 'Normal/Oily', 'Volume': '8 oz', 'Key Ingredients': 'Kale, Spinach', 'Benefits': 'Deep Pore Cleanse' } }
        ],
        'Makeup': [
            { name: 'Luminous Silk Foundation', brand: 'Giorgio Armani', price: '69.00', countInStock: '60', imageUrl: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?q=80&w=800&auto=format&fit=crop', attributes: { 'Shade': '5.5 Medium', 'Skin Type': 'All Skin Types', 'Finish': 'Radiant', 'Expiry Date': '12 Months' } },
            { name: 'Superstay Matte Ink', brand: 'Maybelline', price: '10.99', countInStock: '400', imageUrl: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=800&auto=format&fit=crop', attributes: { 'Shade': 'Pioneer (Red)', 'Skin Type': 'Universal', 'Finish': 'Matte', 'Expiry Date': '24 Months' } },
            { name: 'Naked Eyeshadow Palette', brand: 'Urban Decay', price: '54.00', countInStock: '150', imageUrl: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=800&auto=format&fit=crop', attributes: { 'Shade': 'Neutral Tones', 'Skin Type': 'All', 'Finish': 'Matte & Shimmer', 'Expiry Date': '24 Months' } },
            { name: 'Shape Tape Concealer', brand: 'Tarte', price: '31.00', countInStock: '200', imageUrl: 'https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?q=80&w=800&auto=format&fit=crop', attributes: { 'Shade': '22N Light Neutral', 'Skin Type': 'All', 'Finish': 'Full Coverage Matte', 'Expiry Date': '12 Months' } },
            { name: 'Pro Filt\'r Foundation', brand: 'Fenty Beauty', price: '40.00', countInStock: '180', imageUrl: 'https://images.unsplash.com/photo-1512496015851-a1ab39b9fa13?q=80&w=800&auto=format&fit=crop', attributes: { 'Shade': '290', 'Skin Type': 'Oily/Combination', 'Finish': 'Soft Matte', 'Expiry Date': '12 Months' } },
            { name: 'Ruby Woo Lipstick', brand: 'MAC', price: '23.00', countInStock: '300', imageUrl: 'https://images.unsplash.com/photo-1512495962295-a1ab39b9fa13?q=80&w=800&auto=format&fit=crop', attributes: { 'Shade': 'Vivid Blue-Red', 'Skin Type': 'All', 'Finish': 'Retro Matte', 'Expiry Date': '24 Months' } },
            { name: 'Pillow Talk Blush', brand: 'Charlotte Tilbury', price: '40.00', countInStock: '110', imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=800&auto=format&fit=crop', attributes: { 'Shade': 'Nude Pink', 'Skin Type': 'All', 'Finish': 'Glowing', 'Expiry Date': '24 Months' } },
            { name: 'Boy Brow Pomade', brand: 'Glossier', price: '18.00', countInStock: '250', imageUrl: 'https://images.unsplash.com/photo-1571781404179-7a54a72d7f87?q=80&w=800&auto=format&fit=crop', attributes: { 'Shade': 'Brown', 'Skin Type': 'All', 'Finish': 'Fluffy', 'Expiry Date': '6 Months' } }
        ]
    };

    const categories = Object.keys(templates);

    const [formData, setFormData] = useState({
        name: '', brand: '', description: '', price: '', category: categories[0], subCategory: '', countInStock: ''
    });
    
    const [attributes, setAttributes] = useState({});
    const [loading, setLoading] = useState(false);
    
    // State to act as a "deck of cards" to ensure 100% no repeats
    const [productPools, setProductPools] = useState({});

    useEffect(() => {
        const subs = Object.keys(templates[formData.category]);
        setFormData(prev => ({ ...prev, subCategory: subs[0] }));
    }, [formData.category]);

    useEffect(() => {
        if (formData.subCategory && templates[formData.category][formData.subCategory]) {
            const fields = templates[formData.category][formData.subCategory];
            const newAttrs = {};
            fields.forEach(field => newAttrs[field] = '');
            setAttributes(newAttrs);
        }
    }, [formData.subCategory, formData.category]);

    const handleMainChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAttributeChange = (e) => {
        setAttributes({ ...attributes, [e.target.name]: e.target.value });
    };

    // Shuffle algorithm to randomize the dataset entirely
    const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    // Draws a completely non-repeated product from the category pool
    const getNextRandomProduct = (subCategory) => {
        let currentPool = productPools[subCategory] || [];

        // If pool is empty (or uninitialized), refill and shuffle it
        if (currentPool.length === 0) {
            const dataList = dummyData[subCategory] || dummyData[Object.keys(dummyData)[0]];
            currentPool = shuffleArray(dataList);
        }

        // Deal the top card
        const selectedProduct = currentPool.pop();

        // Update the deck
        setProductPools(prev => ({
            ...prev,
            [subCategory]: currentPool
        }));

        return selectedProduct;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const safeSubCategory = dummyData[formData.subCategory] ? formData.subCategory : Object.keys(dummyData)[0];
            
            // Gets a perfectly unique product relative to the recent clicks
            const randomPick = getNextRandomProduct(safeSubCategory);
            
            const uniqueVariantId = Math.floor(Math.random() * 9000) + 1000;
            
            const finalName = formData.name.trim() || `${randomPick.name} - Model ${uniqueVariantId}`;
            const finalBrand = formData.brand.trim() || randomPick.brand;
            const finalPrice = formData.price ? Number(formData.price) : Number(randomPick.price);
            const finalStock = formData.countInStock ? Number(formData.countInStock) : Number(randomPick.countInStock);
            const finalDescription = formData.description.trim() || `Premium ${formData.subCategory.toLowerCase()} providing incredible value and performance.`;

            // Enforce explicit image link flawlessly matched to the product
            const finalImageUrl = randomPick.imageUrl;

            const finalAttributes = {};
            Object.keys(attributes).forEach(key => {
                finalAttributes[key] = attributes[key].trim() || (randomPick.attributes && randomPick.attributes[key]) || 'Standard';
            });

            await api.post('/products', {
                name: finalName,
                brand: finalBrand,
                description: finalDescription,
                price: finalPrice,
                category: formData.category,
                subCategory: formData.subCategory,
                countInStock: finalStock,
                attributes: finalAttributes,
                imageUrl: finalImageUrl 
            });

            alert('Product added successfully!');
            navigate('/'); 
        } catch (error) {
            console.error("Error adding product", error);
            alert("Failed to add product.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mt-8 mb-16">
            <h1 className="text-3xl font-bold mb-2 text-gray-900">Add New Product</h1>
            <p className="text-gray-500 mb-8 pb-4 border-b">Select a template. Leave fields blank to randomly auto-fill with standard specifications.</p>
            
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                    <h2 className="text-lg font-bold text-indigo-900 mb-4">1. Choose Template</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-indigo-800 mb-2">Category</label>
                            <select name="category" value={formData.category} onChange={handleMainChange} className="w-full px-4 py-3 bg-white border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500">
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-indigo-800 mb-2">Product Type</label>
                            <select name="subCategory" value={formData.subCategory} onChange={handleMainChange} className="w-full px-4 py-3 bg-white border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500">
                                {Object.keys(templates[formData.category]).map(sub => <option key={sub} value={sub}>{sub}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-4">2. Core Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Product Title</label>
                            <input type="text" name="name" value={formData.name} onChange={handleMainChange} className="w-full px-4 py-3 bg-gray-50 border rounded-xl" placeholder="Leave blank to auto-fill randomly" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Brand</label>
                            <input type="text" name="brand" value={formData.brand} onChange={handleMainChange} className="w-full px-4 py-3 bg-gray-50 border rounded-xl" placeholder="Leave blank to auto-fill randomly" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Price ($)</label>
                            <input type="number" step="0.01" name="price" value={formData.price} onChange={handleMainChange} className="w-full px-4 py-3 bg-gray-50 border rounded-xl" placeholder="Leave blank to auto-fill randomly" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Initial Stock Quantity</label>
                            <input type="number" name="countInStock" value={formData.countInStock} onChange={handleMainChange} className="w-full px-4 py-3 bg-gray-50 border rounded-xl" placeholder="Leave blank to auto-fill randomly" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                            <textarea name="description" value={formData.description} onChange={handleMainChange} rows="3" className="w-full px-4 py-3 bg-gray-50 border rounded-xl" placeholder="Leave blank to auto-fill randomly"></textarea>
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-4">3. Specifications</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {Object.keys(attributes).map(key => (
                            <div key={key}>
                                <label className="block text-sm font-semibold text-gray-600 mb-1">{key}</label>
                                <input type="text" name={key} value={attributes[key]} onChange={handleAttributeChange} className="w-full px-3 py-2 bg-gray-50 border rounded-lg text-sm" placeholder={`Auto-fill randomly`} />
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="pt-6 border-t">
                    <button type="submit" disabled={loading} className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-gray-800 shadow-md transition-all">
                        {loading ? 'Publishing...' : 'Publish Product'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;