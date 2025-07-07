import React from 'react';
// import './HeroSection.css'; // Don't forget to create a CSS file for styling

const NewsletterFooter= () => {
  return (
    <footer>
            <h2>Subscribe to Newsletter</h2>
            <form>
                <input type="email" placeholder="Enter your email" required />
                <button type="submit">Subscribe</button>
            </form>
            <div>
                <p>📞 Phone / WhatsApp: 1189192243</p>
                <p>Email: info@davidacademy.in</p>
                <p>Working Hours: Mon - Sat 9 AM - 6 PM, Sunday: Closed</p>
            </div>
            <p>&copy; 2023 David Academy. All rights reserved. Designed by Lunar Enterprises</p>
        </footer>
  );
};

export default NewsletterFooter;
