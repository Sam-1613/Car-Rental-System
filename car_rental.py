"""
Car Rental System - Minimal Python CLI Implementation
Currency: INR (₹)
Tech Stack: Python 3 Standard Library (Zero External Dependencies)
"""

import sys

# Ensure UTF-8 console output for Windows terminal support with currency symbols
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass


class Car:
    def __init__(self, car_id, make, model, category, price_per_day):
        self.car_id = car_id
        self.make = make
        self.model = model
        self.category = category
        self.price_per_day = price_per_day
        self.is_available = True

    def __str__(self):
        status = "Available" if self.is_available else "Rented"
        return f"[{self.car_id}] {self.make} {self.model} ({self.category}) - ₹{self.price_per_day:,}/day | {status}"


class RentalRecord:
    def __init__(self, rental_id, car, customer_name, days):
        self.rental_id = rental_id
        self.car = car
        self.customer_name = customer_name
        self.days = days
        self.total_cost = days * car.price_per_day


class CarRentalSystem:
    def __init__(self):
        self.fleet = [
            Car("C101", "Maruti Suzuki", "Swift ZXi", "Hatchback", 1600),
            Car("C102", "Hyundai", "Creta SX(O)", "SUV", 2800),
            Car("C103", "Mahindra", "Thar 4x4", "SUV", 3500),
            Car("C104", "Tata", "Nexon.ev", "Electric", 2400),
            Car("C105", "Toyota", "Innova Crysta", "SUV", 3900),
            Car("C106", "Honda", "City ZX", "Sedan", 2500),
            Car("C107", "Toyota", "Fortuner Legender", "Luxury", 5800),
        ]
        self.active_rentals = {}
        self.rental_counter = 1000

    def display_available_cars(self):
        print("\n--- AVAILABLE VEHICLES ---")
        available = [c for c in self.fleet if c.is_available]
        if not available:
            print("No vehicles currently available for rent.")
            return
        for car in available:
            print(f"ID: {car.car_id:<6} | {car.make} {car.model:<20} | Type: {car.category:<10} | Rate: ₹{car.price_per_day:,}/day")

    def display_all_cars(self):
        print("\n--- FULL FLEET STATUS ---")
        for car in self.fleet:
            print(car)

    def rent_car(self):
        self.display_available_cars()
        car_id = input("\nEnter Car ID to rent: ").strip().upper()
        
        car = next((c for c in self.fleet if c.car_id == car_id and c.is_available), None)
        if not car:
            print(f"Error: Car ID '{car_id}' is not available or does not exist.")
            return

        customer = input("Enter Customer Full Name: ").strip()
        if not customer:
            print("Customer name cannot be empty.")
            return

        try:
            days = int(input("Enter Rental Duration (in days): ").strip())
            if days <= 0:
                print("Days must be greater than 0.")
                return
        except ValueError:
            print("Invalid number of days.")
            return

        self.rental_counter += 1
        rental_id = f"RNT-{self.rental_counter}"
        record = RentalRecord(rental_id, car, customer, days)
        car.is_available = False
        self.active_rentals[rental_id] = record

        print("\n" + "=" * 45)
        print("           BOOKING CONFIRMED")
        print("=" * 45)
        print(f"Rental ID      : {record.rental_id}")
        print(f"Customer       : {record.customer_name}")
        print(f"Vehicle        : {car.make} {car.model}")
        print(f"Duration       : {record.days} day(s)")
        print(f"Total Amount   : ₹{record.total_cost:,}")
        print("=" * 45)

    def return_car(self):
        if not self.active_rentals:
            print("\nThere are no ongoing active rentals to return.")
            return

        print("\n--- ACTIVE RENTALS ---")
        for r_id, rec in self.active_rentals.items():
            print(f"[{r_id}] Customer: {rec.customer_name:<15} | Car: {rec.car.make} {rec.car.model} | Total: ₹{rec.total_cost:,}")

        rental_id = input("\nEnter Rental ID to return: ").strip().upper()
        record = self.active_rentals.get(rental_id)

        if not record:
            print(f"Error: Rental ID '{rental_id}' not found.")
            return

        record.car.is_available = True
        del self.active_rentals[rental_id]

        print("\n" + "=" * 45)
        print("           INVOICE / RECEIPT")
        print("=" * 45)
        print(f"Rental ID      : {record.rental_id}")
        print(f"Customer       : {record.customer_name}")
        print(f"Vehicle        : {record.car.make} {record.car.model}")
        print(f"Days Rented    : {record.days}")
        print(f"Total Paid     : ₹{record.total_cost:,}")
        print("Status         : Vehicle successfully returned!")
        print("=" * 45)

    def view_active_rentals(self):
        print("\n--- CURRENT ACTIVE RENTALS ---")
        if not self.active_rentals:
            print("No active rentals.")
            return
        for r_id, rec in self.active_rentals.items():
            print(f"Rental ID: {r_id:<8} | Customer: {rec.customer_name:<15} | Car: {rec.car.make} {rec.car.model} | Total: ₹{rec.total_cost:,}")

    def add_car(self):
        print("\n--- ADD NEW VEHICLE ---")
        make = input("Enter Make/Brand (e.g. Maruti Suzuki, Mahindra, Tata): ").strip()
        model = input("Enter Model (e.g. Baleno, XUV700): ").strip()
        category = input("Enter Category (Hatchback/Sedan/SUV/Electric/Luxury): ").strip()
        try:
            rate = float(input("Enter Daily Rate (₹): ").strip())
            if rate <= 0:
                print("Daily rate must be positive.")
                return
        except ValueError:
            print("Invalid rate.")
            return

        new_id = f"C{101 + len(self.fleet)}"
        new_car = Car(new_id, make, model, category, rate)
        self.fleet.append(new_car)
        print(f"Vehicle added successfully! Assigned ID: {new_id}")


def main():
    system = CarRentalSystem()

    while True:
        print("\n" + "=" * 45)
        print("        CAR RENTAL SYSTEM (INR / ₹)")
        print("=" * 45)
        print("1. View Available Cars")
        print("2. Rent a Car")
        print("3. Return a Car & Print Invoice")
        print("4. View Active Rentals")
        print("5. View Entire Fleet")
        print("6. Add New Car to Fleet")
        print("7. Exit")
        print("=" * 45)

        choice = input("Enter your choice (1-7): ").strip()

        if choice == "1":
            system.display_available_cars()
        elif choice == "2":
            system.rent_car()
        elif choice == "3":
            system.return_car()
        elif choice == "4":
            system.view_active_rentals()
        elif choice == "5":
            system.display_all_cars()
        elif choice == "6":
            system.add_car()
        elif choice == "7":
            print("\nThank you for using Car Rental System. Goodbye!\n")
            break
        else:
            print("Invalid selection. Please choose a number from 1 to 7.")


if __name__ == "__main__":
    main()
