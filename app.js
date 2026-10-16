// Initial Default Fleet Data with Exact Indian Car Photos
const DEFAULT_CARS = [
  {
    id: "car-1",
    make: "Maruti Suzuki",
    model: "Swift ZXi",
    category: "Hatchback",
    pricePerDay: 1600,
    seats: 5,
    transmission: "Manual",
    image: "images/swift.jpg",
    isAvailable: true
  },
  {
    id: "car-2",
    make: "Hyundai",
    model: "Creta SX(O)",
    category: "SUV",
    pricePerDay: 2800,
    seats: 5,
    transmission: "Automatic",
    image: "images/creta.jpg",
    isAvailable: true
  },
  {
    id: "car-3",
    make: "Mahindra",
    model: "Thar 4x4 Hard Top",
    category: "SUV",
    pricePerDay: 3500,
    seats: 4,
    transmission: "Manual",
    image: "images/thar.jpg",
    isAvailable: true
  },
  {
    id: "car-4",
    make: "Tata",
    model: "Nexon.ev Empowered",
    category: "Electric",
    pricePerDay: 2400,
    seats: 5,
    transmission: "Automatic",
    image: "images/nexon.png",
    isAvailable: true
  },
  {
    id: "car-5",
    make: "Toyota",
    model: "Innova Crysta 2.4 VX",
    category: "SUV",
    pricePerDay: 3900,
    seats: 7,
    transmission: "Automatic",
    image: "images/innova.jpg",
    isAvailable: true
  },
  {
    id: "car-6",
    make: "Honda",
    model: "City 5th Gen ZX",
    category: "Sedan",
    pricePerDay: 2500,
    seats: 5,
    transmission: "Automatic",
    image: "images/city.jpg",
    isAvailable: true
  },
  {
    id: "car-7",
    make: "Toyota",
    model: "Fortuner Legender 4x4",
    category: "Luxury",
    pricePerDay: 5800,
    seats: 7,
    transmission: "Automatic",
    image: "images/fortuner.jpg",
    isAvailable: true
  }
];

// App State (with v2 keys so fresh exact images load immediately)
const STORAGE_KEY_CARS = "quickrent_inr_v2_cars";
const STORAGE_KEY_RENTALS = "quickrent_inr_v2_rentals";
const STORAGE_KEY_REVENUE = "quickrent_inr_v2_revenue";

let cars = JSON.parse(localStorage.getItem(STORAGE_KEY_CARS)) || DEFAULT_CARS;
let rentals = JSON.parse(localStorage.getItem(STORAGE_KEY_RENTALS)) || [];
let revenue = parseFloat(localStorage.getItem(STORAGE_KEY_REVENUE)) || 0;

let currentCategory = "all";
let searchQuery = "";

// Save to LocalStorage
function saveData() {
  localStorage.setItem(STORAGE_KEY_CARS, JSON.stringify(cars));
  localStorage.setItem(STORAGE_KEY_RENTALS, JSON.stringify(rentals));
  localStorage.setItem(STORAGE_KEY_REVENUE, revenue.toString());
}

// Update Header Statistics (Formatted in Indian Numbering System)
function updateStats() {
  const total = cars.length;
  const available = cars.filter(c => c.isAvailable).length;
  const rented = total - available;

  document.getElementById("stat-total-cars").textContent = total;
  document.getElementById("stat-available-cars").textContent = available;
  document.getElementById("stat-rented-cars").textContent = rented;
  document.getElementById("stat-total-revenue").textContent = `₹${revenue.toLocaleString("en-IN")}`;
  document.getElementById("rental-badge").textContent = rentals.length;
}

// Render Fleet Grid
function renderFleet() {
  const grid = document.getElementById("car-grid");
  grid.innerHTML = "";

  const filtered = cars.filter(car => {
    const matchesCat = currentCategory === "all" || car.category.toLowerCase() === currentCategory.toLowerCase();
    const matchesSearch = `${car.make} ${car.model} ${car.category}`.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="empty-state" style="grid-column: 1 / -1;"><p>No vehicles match your criteria.</p></div>`;
    return;
  }

  filtered.forEach(car => {
    const card = document.createElement("div");
    card.className = "car-card";
    const statusClass = car.isAvailable ? "available" : "rented";
    const statusText = car.isAvailable ? "Available" : "Rented";

    const defaultImg = "images/swift.jpg";

    card.innerHTML = `
      <div class="car-img-wrapper">
        <img src="${car.image || defaultImg}" alt="${car.make} ${car.model}" onerror="this.src='${defaultImg}'">
        <span class="car-status-badge ${statusClass}">${statusText}</span>
      </div>
      <div class="car-info">
        <div class="car-header">
          <h3 class="car-title">${car.make} ${car.model}</h3>
          <span class="car-category-tag">${car.category}</span>
        </div>
        <div class="car-specs">
          <span class="car-spec-item">👥 ${car.seats} Seats</span>
          <span class="car-spec-item">⚙️ ${car.transmission}</span>
        </div>
        <div class="car-footer">
          <div class="car-price">₹${car.pricePerDay.toLocaleString("en-IN")} <span>/ day</span></div>
          <button class="btn btn-primary" onclick="openRentModal('${car.id}')" ${!car.isAvailable ? "disabled" : ""}>
            ${car.isAvailable ? "Rent Now" : "Unavailable"}
          </button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Render Active Rentals Table
function renderRentals() {
  const tbody = document.getElementById("rentals-table-body");
  const emptyMsg = document.getElementById("no-rentals-msg");
  tbody.innerHTML = "";

  if (rentals.length === 0) {
    emptyMsg.style.display = "block";
    return;
  }
  emptyMsg.style.display = "none";

  rentals.forEach(r => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><strong>${r.rentalId}</strong></td>
      <td>${r.carTitle}</td>
      <td>${r.customerName}</td>
      <td>${r.customerPhone}</td>
      <td>${r.days} Days</td>
      <td><strong>₹${r.totalCost.toLocaleString("en-IN")}</strong></td>
      <td>
        <button class="btn btn-outline-danger" onclick="returnCar('${r.rentalId}')">
          Return Car
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// Modal Handlers
const rentModal = document.getElementById("rent-modal");
const addCarModal = document.getElementById("add-car-modal");
let selectedCarForRent = null;

window.openRentModal = function(carId) {
  selectedCarForRent = cars.find(c => c.id === carId);
  if (!selectedCarForRent || !selectedCarForRent.isAvailable) return;

  document.getElementById("rent-car-id").value = carId;
  document.getElementById("rent-car-title").textContent = `Rent ${selectedCarForRent.make} ${selectedCarForRent.model}`;
  document.getElementById("modal-daily-rate").textContent = `₹${selectedCarForRent.pricePerDay.toLocaleString("en-IN")}`;
  
  updateModalTotal();
  rentModal.classList.add("active");
};

function updateModalTotal() {
  if (!selectedCarForRent) return;
  const days = parseInt(document.getElementById("rental-days").value, 10) || 1;
  const total = days * selectedCarForRent.pricePerDay;
  document.getElementById("modal-total-cost").textContent = `₹${total.toLocaleString("en-IN")}`;
}

document.getElementById("rental-days").addEventListener("input", updateModalTotal);

// Close Modals
document.querySelectorAll("[data-close]").forEach(btn => {
  btn.addEventListener("click", () => {
    rentModal.classList.remove("active");
    addCarModal.classList.remove("active");
  });
});

// Close when clicking backdrop
document.querySelectorAll(".modal-backdrop").forEach(backdrop => {
  backdrop.addEventListener("click", () => {
    rentModal.classList.remove("active");
    addCarModal.classList.remove("active");
  });
});

// Rent Form Submission
document.getElementById("rent-form").addEventListener("submit", (e) => {
  e.preventDefault();
  if (!selectedCarForRent) return;

  const days = parseInt(document.getElementById("rental-days").value, 10) || 1;
  const customerName = document.getElementById("customer-name").value.trim();
  const customerPhone = document.getElementById("customer-phone").value.trim();
  const totalCost = days * selectedCarForRent.pricePerDay;

  const newRental = {
    rentalId: "RNT-" + Math.floor(1000 + Math.random() * 9000),
    carId: selectedCarForRent.id,
    carTitle: `${selectedCarForRent.make} ${selectedCarForRent.model}`,
    customerName,
    customerPhone,
    days,
    totalCost,
    rentedAt: new Date().toLocaleDateString()
  };

  // Update car status
  selectedCarForRent.isAvailable = false;
  rentals.push(newRental);
  revenue += totalCost;

  saveData();
  updateStats();
  renderFleet();
  renderRentals();

  rentModal.classList.remove("active");
  document.getElementById("rent-form").reset();
  alert(`Booking Confirmed!\nRental ID: ${newRental.rentalId}\nVehicle: ${newRental.carTitle}\nTotal Due: ₹${totalCost.toLocaleString("en-IN")}`);
});

// Return Car Function
window.returnCar = function(rentalId) {
  const rentalIndex = rentals.findIndex(r => r.rentalId === rentalId);
  if (rentalIndex === -1) return;

  const rental = rentals[rentalIndex];
  const car = cars.find(c => c.id === rental.carId);
  if (car) car.isAvailable = true;

  rentals.splice(rentalIndex, 1);
  saveData();
  updateStats();
  renderFleet();
  renderRentals();

  alert(`Vehicle "${rental.carTitle}" has been returned and added back to the available fleet!`);
};

// Add New Car Form
document.getElementById("open-add-car-btn").addEventListener("click", () => {
  addCarModal.classList.add("active");
});

document.getElementById("add-car-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const newCar = {
    id: "car-" + Date.now(),
    make: document.getElementById("car-make").value.trim(),
    model: document.getElementById("car-model").value.trim(),
    category: document.getElementById("car-category").value,
    pricePerDay: parseFloat(document.getElementById("car-price").value),
    transmission: document.getElementById("car-transmission").value,
    seats: parseInt(document.getElementById("car-seats").value, 10),
    image: document.getElementById("car-image").value.trim() || "images/swift.jpg",
    isAvailable: true
  };

  cars.unshift(newCar);
  saveData();
  updateStats();
  renderFleet();

  addCarModal.classList.remove("active");
  document.getElementById("add-car-form").reset();
  alert(`Successfully added ${newCar.make} ${newCar.model} to the fleet!`);
});

// Tab Navigation
document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const tab = btn.dataset.tab;
    document.querySelectorAll(".tab-view").forEach(view => view.classList.remove("active"));
    document.getElementById(`${tab}-view`).classList.add("active");
  });
});

// Filter Pills
document.querySelectorAll("#category-filters .pill").forEach(pill => {
  pill.addEventListener("click", () => {
    document.querySelectorAll("#category-filters .pill").forEach(p => p.classList.remove("active"));
    pill.classList.add("active");
    currentCategory = pill.dataset.category;
    renderFleet();
  });
});

// Search Input
document.getElementById("search-input").addEventListener("input", (e) => {
  searchQuery = e.target.value;
  renderFleet();
});

// Initialization
updateStats();
renderFleet();
renderRentals();
