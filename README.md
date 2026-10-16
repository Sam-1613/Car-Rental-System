# 🚗 Indian Car Rental System (Minimal & Lightweight)

A minimal, zero-dependency Car Rental System tailored for the Indian market with currency in **INR (₹)** and featuring the most common Indian vehicles (*Maruti Suzuki Swift, Hyundai Creta, Mahindra Thar, Tata Nexon.ev, Toyota Innova Crysta, Honda City, Toyota Fortuner*).

This project includes both a modern **Web Application** and a clean **Python CLI Application**.

---

## 🛠️ Tech Stack (Zero Dependencies)

1. **Web Frontend**:
   - **HTML5**: Semantic UI, booking modals, accessible structure.
   - **CSS3**: Modern responsive layout, card grids, status badges, flexbox & CSS grid.
   - **Vanilla JavaScript**: State management, live INR (₹) pricing calculation, category filtering (*Hatchback, Sedan, SUV, Electric, Luxury*), and `localStorage` persistence.
   - *Requires no node_modules, no npm build steps, and no third-party libraries.*

2. **Terminal / CLI**:
   - **Python 3 Standard Library**: Object-Oriented Programming (OOP) with `Car`, `RentalRecord`, and `CarRentalSystem` classes.
   - *Supports Windows console UTF-8 Indian Rupee (`₹`) rendering.*
   - *Requires no `pip install` or external packages.*

---

## 🚘 Pre-Configured Fleet (Popular Indian Cars)

| Vehicle | Make | Category | Daily Rate | Seats |
| :--- | :--- | :--- | :--- | :--- |
| **Swift ZXi** | Maruti Suzuki | Hatchback | ₹1,600 / day | 5 |
| **Creta SX(O)** | Hyundai | SUV | ₹2,800 / day | 5 |
| **Thar 4x4** | Mahindra | SUV | ₹3,500 / day | 4 |
| **Nexon.ev** | Tata | Electric | ₹2,400 / day | 5 |
| **Innova Crysta** | Toyota | SUV / MPV | ₹3,900 / day | 7 |
| **City ZX** | Honda | Sedan | ₹2,500 / day | 5 |
| **Fortuner Legender** | Toyota | Luxury | ₹5,800 / day | 7 |

---

## 📂 Project Structure

```text
Car Rental System/
├── index.html        # Web application layout & modal dialogs
├── style.css         # Modern, responsive styling & theme variables
├── app.js            # Rental calculations, filtering, and local storage state
├── car_rental.py     # Standalone Python CLI Car Rental System
└── README.md         # Project documentation & run guide
```

---

## 🚀 How to Run

### Option 1: Web Application (Browser)
No server installation required:
- Simply double-click [**`index.html`**](index.html) in your file manager to open it directly in any web browser (Chrome, Edge, Firefox, Safari).
- Or run Python's built-in lightweight local server:
  ```bash
  python -m http.server 8000
  ```
  Then open `http://localhost:8000` in your browser.

### Option 2: Python CLI (Terminal)
Run the interactive console application:
```bash
python car_rental.py
```

---

## ✨ Features

- **Fleet Catalog & Filtering**: Browse vehicles by category (`Hatchback`, `Sedan`, `SUV`, `Electric`, `Luxury`) or search by model name.
- **Booking & Dynamic Billing in INR (₹)**: Real-time price calculation formatted with Indian numbering (e.g. ₹2,800/day).
- **Vehicle Availability Status**: Cars automatically switch status between `Available` and `Rented`.
- **Return & Invoicing**: Return rented vehicles back to the fleet with an instant receipt/invoice.
- **Fleet Management**: Add new vehicles directly to the fleet with custom INR pricing and specifications.
- **Data Persistence**: Web version automatically persists all data and active rentals in browser `localStorage`.
