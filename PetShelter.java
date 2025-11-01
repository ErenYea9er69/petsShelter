// Main class to manage pets
public class PetShelter {
    private static final int MAX_PETS = 100;
    private Animal[] pets;
    private int petCount;
    
    public PetShelter() {
        pets = new Animal[MAX_PETS];
        petCount = 0;
    }
    
    // Add pet to the shelter
    public boolean addPet(Animal pet) {
        if (petCount < MAX_PETS) {
            pets[petCount] = pet;
            petCount++;
            System.out.println(pet.getName() + " added successfully!");
            return true;
        } else {
            System.out.println("Shelter is full! Cannot add " + pet.getName());
            return false;
        }
    }
    
    // Delete pet by name from the shelter
    public boolean deletePet(String petName) {
        for (int i = 0; i < petCount; i++) {
            if (pets[i].getName().equalsIgnoreCase(petName)) {
                System.out.println("Deleting " + pets[i].getName() + " from shelter...");
                
                // Shift all elements to the left to fill the gap
                for (int j = i; j < petCount - 1; j++) {
                    pets[j] = pets[j + 1];
                }
                
                pets[petCount - 1] = null;
                petCount--;
                System.out.println(petName + " has been removed.");
                return true;
            }
        }
        System.out.println("Pet named '" + petName + "' not found in shelter.");
        return false;
    }
    
    // Delete pet by index
    public boolean deletePetByIndex(int index) {
        if (index < 0 || index >= petCount) {
            System.out.println("Invalid index!");
            return false;
        }
        
        String petName = pets[index].getName();
        System.out.println("Deleting " + petName + " from shelter...");
        
        // Shift all elements to the left to fill the gap
        for (int j = index; j < petCount - 1; j++) {
            pets[j] = pets[j + 1];
        }
        
        pets[petCount - 1] = null;
        petCount--;
        System.out.println(petName + " has been removed.");
        return true;
    }
    
    // Get pet by name
    public Animal getPet(String petName) {
        for (int i = 0; i < petCount; i++) {
            if (pets[i].getName().equalsIgnoreCase(petName)) {
                return pets[i];
            }
        }
        return null;
    }
    
    // Get pet by index
    public Animal getPetByIndex(int index) {
        if (index >= 0 && index < petCount) {
            return pets[index];
        }
        return null;
    }
    
    // Get detailed information about a pet
    public String getPetDetailedInfo(String petName) {
        Animal pet = getPet(petName);
        if (pet != null) {
            return pet.getDetailedInfo();
        }
        return "Pet named '" + petName + "' not found.";
    }
    
    // Get sound using polymorphism
    public String getPetSound(String petName) {
        Animal pet = getPet(petName);
        if (pet != null) {
            return pet.getName() + " says: " + pet.makeSound();
        }
        return "Pet named '" + petName + "' not found.";
    }
    
    // Get all pets
    public Animal[] getAllPets() {
        Animal[] result = new Animal[petCount];
        for (int i = 0; i < petCount; i++) {
            result[i] = pets[i];
        }
        return result;
    }
    
    // Make all pets sound
    public void makeAllPetsSound() {
        System.out.println("\n=== All Pets Making Sounds ===");
        for (int i = 0; i < petCount; i++) {
            System.out.println(pets[i].getName() + " says: " + pets[i].makeSound());
        }
    }
    
    // Display all pets with their information
    public void displayAllPets() {
        if (petCount == 0) {
            System.out.println("No pets in the shelter.");
            return;
        }
        
        System.out.println("\n=== All Pets in Shelter ===");
        for (int i = 0; i < petCount; i++) {
            System.out.println("\nPet #" + (i + 1) + ":");
            System.out.println(pets[i].getDetailedInfo());
            System.out.println("---");
        }
    }
    
    public int getPetCount() {
        return petCount;
    }
    
    public int getMaxPets() {
        return MAX_PETS;
    }
    
    public int getRemainingCapacity() {
        return MAX_PETS - petCount;
    }
}