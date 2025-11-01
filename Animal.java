// Base class with default implementations
public class Animal {
    protected String name;
    protected int age;
    protected String color;
    
    public Animal(String name, int age, String color) {
        this.name = name;
        this.age = age;
        this.color = color;
    }
    
    // Default implementation - can be overridden by subclasses
    public String makeSound() {
        return "Some generic animal sound";
    }
    
    // Default implementation - can be overridden by subclasses
    public String getSpecialAbility() {
        return "Has basic animal abilities";
    }
    
    // Common method for all animals
    public String getInfo() {
        return name + " (" + age + " years old, " + color + ")";
    }
    
    // Get detailed information about the pet
    public String getDetailedInfo() {
        return "Name: " + name + "\n" +
               "Age: " + age + " years old\n" +
               "Color: " + color + "\n" +
               "Sound: " + makeSound() + "\n" +
               "Special Ability: " + getSpecialAbility();
    }
    
    public String getName() { return name; }
    public int getAge() { return age; }
    public String getColor() { return color; }
}

// Dog class extending Animal
class Dog extends Animal {
    private String breed;
    
    public Dog(String name, int age, String color, String breed) {
        super(name, age, color);
        this.breed = breed;
    }
    
    @Override
    public String makeSound() {
        return "Woof! Woof!";
    }
    
    @Override
    public String getSpecialAbility() {
        return "Can fetch and guard the house";
    }
    
    @Override
    public String getDetailedInfo() {
        return "Type: Dog\n" +
               "Name: " + name + "\n" +
               "Age: " + age + " years old\n" +
               "Color: " + color + "\n" +
               "Breed: " + breed + "\n" +
               "Sound: " + makeSound() + "\n" +
               "Special Ability: " + getSpecialAbility();
    }
    
    public String getBreed() {
        return breed;
    }
}

// Cat class extending Animal
class Cat extends Animal {
    private boolean isIndoor;
    
    public Cat(String name, int age, String color, boolean isIndoor) {
        super(name, age, color);
        this.isIndoor = isIndoor;
    }
    
    @Override
    public String makeSound() {
        return "Meow! Meow!";
    }
    
    @Override
    public String getSpecialAbility() {
        return "Expert climber and mouse hunter";
    }
    
    @Override
    public String getDetailedInfo() {
        String type = isIndoor ? "Indoor" : "Outdoor";
        return "Type: Cat (" + type + ")\n" +
               "Name: " + name + "\n" +
               "Age: " + age + " years old\n" +
               "Color: " + color + "\n" +
               "Sound: " + makeSound() + "\n" +
               "Special Ability: " + getSpecialAbility();
    }
    
    public boolean isIndoor() {
        return isIndoor;
    }
}

// Bird class extending Animal
class Bird extends Animal {
    private double wingSpan;
    
    public Bird(String name, int age, String color, double wingSpan) {
        super(name, age, color);
        this.wingSpan = wingSpan;
    }
    
    @Override
    public String makeSound() {
        return "Tweet! Tweet!";
    }
    
    @Override
    public String getSpecialAbility() {
        return "Can fly up to " + wingSpan + " meters high";
    }
    
    @Override
    public String getDetailedInfo() {
        return "Type: Bird\n" +
               "Name: " + name + "\n" +
               "Age: " + age + " years old\n" +
               "Color: " + color + "\n" +
               "Wing Span: " + wingSpan + " meters\n" +
               "Sound: " + makeSound() + "\n" +
               "Special Ability: " + getSpecialAbility();
    }
    
    public double getWingSpan() {
        return wingSpan;
    }
}

// Main class to manage pets
class PetShelter {
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

// Demo class
class PetManagementSystem {
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