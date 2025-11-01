// Demo class
public class PetManagementSystem {
    public static void main(String[] args) {
        PetShelter shelter = new PetShelter();
        
        System.out.println("=== Pet Shelter Management System ===");
        System.out.println("Maximum capacity: " + shelter.getMaxPets() + " pets\n");
        
        // Creating different types of animals
        Dog dog1 = new Dog("Max", 3, "Brown", "Golden Retriever");
        Dog dog2 = new Dog("Buddy", 5, "Black", "Labrador");
        Cat cat1 = new Cat("Whiskers", 2, "White", true);
        Cat cat2 = new Cat("Shadow", 4, "Gray", false);
        Bird bird1 = new Bird("Tweety", 1, "Yellow", 15.5);
        
        // Adding pets to the shelter
        shelter.addPet(dog1);
        shelter.addPet(dog2);
        shelter.addPet(cat1);
        shelter.addPet(cat2);
        shelter.addPet(bird1);
        
        System.out.println("\nCurrent capacity: " + shelter.getPetCount() + "/" + shelter.getMaxPets());
        System.out.println("Remaining slots: " + shelter.getRemainingCapacity());
        
        // Display all pets
        shelter.displayAllPets();
        
        // Make all pets sound
        shelter.makeAllPetsSound();
        
        // View detailed info of a specific pet
        System.out.println("\n=== Detailed Info for Max ===");
        System.out.println(shelter.getPetDetailedInfo("Max"));
        
        // Delete a pet
        System.out.println("\n=== Removing a pet ===");
        shelter.deletePet("Buddy");
        
        // Display updated list
        System.out.println("\nUpdated pet count: " + shelter.getPetCount());
        shelter.displayAllPets();
        
        // Add a new pet
        System.out.println("\n=== Adding a new pet ===");
        Bird bird2 = new Bird("Polly", 2, "Green", 18.0);
        shelter.addPet(bird2);
        
        // Final display
        shelter.displayAllPets();
    }
}