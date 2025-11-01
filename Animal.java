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
    
    public String getName() { return name; }
    public int getAge() { return age; }
    public String getColor() { return color; }
}

// Dog class extending Animal
class Dog extends Animal {
    private String breed;
    
    public Dog(String name, int age, String color, String breed) {
        super(name, age, color);  // Call parent constructor
        this.breed = breed;
    }
    
    // Override parent method to provide Dog-specific behavior
    @Override
    public String makeSound() {
        return "Woof! Woof!";
    }
    
    // Override parent method to provide Dog-specific behavior
    @Override
    public String getSpecialAbility() {
        return "Can fetch and guard the house";
    }
    
    public String getBreed() {
        return breed;
    }
}

// Cat class extending Animal
class Cat extends Animal {
    private boolean isIndoor;
    
    public Cat(String name, int age, String color, boolean isIndoor) {
        super(name, age, color);  // Call parent constructor
        this.isIndoor = isIndoor;
    }
    
    // Override parent method to provide Cat-specific behavior
    @Override
    public String makeSound() {
        return "Meow! Meow!";
    }
    
    // Override parent method to provide Cat-specific behavior
    @Override
    public String getSpecialAbility() {
        return "Expert climber and mouse hunter";
    }
    
    public boolean isIndoor() {
        return isIndoor;
    }
}

// Bird class extending Animal
class Bird extends Animal {
    private double wingSpan;
    
    public Bird(String name, int age, String color, double wingSpan) {
        super(name, age, color);  // Call parent constructor
        this.wingSpan = wingSpan;
    }
    
    // Override parent method to provide Bird-specific behavior
    @Override
    public String makeSound() {
        return "Tweet! Tweet!";
    }
    
    // Override parent method to provide Bird-specific behavior
    @Override
    public String getSpecialAbility() {
        return "Can fly up to " + wingSpan + " meters high";
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
    
    // Add pet to the table
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
    
    // Delete pet by name from the table
    public boolean deletePet(String petName) {
        for (int i = 0; i < petCount; i++) {
            if (pets[i].getName().equalsIgnoreCase(petName)) {
                System.out.println("Deleting " + pets[i].getName() + " from shelter...");
                
                // Shift all elements to the left to fill the gap
                for (int j = i; j < petCount - 1; j++) {
                    pets[j] = pets[j + 1];
                }
                
                pets[petCount - 1] = null;  // Clear the last position
                petCount--;
                System.out.println(petName + " has been removed.");
                return true;
            }
        }
        System.out.println("Pet named '" + petName + "' not found in shelter.");
        return false;
    }
    
    // Get sound using instanceof to check the actual class type
    public String getPetSound(String petName) {
        for (int i = 0; i < petCount; i++) {
            if (pets[i].getName().equalsIgnoreCase(petName)) {
                Animal pet = pets[i];
                
                if (pet instanceof Dog) {
                    return pet.getName() + " (Dog) says: Woof! Woof!";
                } else if (pet instanceof Cat) {
                    return pet.getName() + " (Cat) says: Meow! Meow!";
                } else if (pet instanceof Bird) {
                    return pet.getName() + " (Bird) says: Tweet! Tweet!";
                } else {
                    return pet.getName() + " (Generic Animal) says: Some generic animal sound";
                }
            }
        }
        return "Pet named '" + petName + "' not found.";
    }
    
    // Get ability using instanceof to check the actual class type
    public String getPetAbility(String petName) {
        for (int i = 0; i < petCount; i++) {
            if (pets[i].getName().equalsIgnoreCase(petName)) {
                Animal pet = pets[i];
                
                if (pet instanceof Dog) {
                    Dog dog = (Dog) pet;  // Cast to Dog to access breed
                    return pet.getName() + " (" + dog.getBreed() + "): Can fetch and guard the house";
                } else if (pet instanceof Cat) {
                    Cat cat = (Cat) pet;  // Cast to Cat to access isIndoor
                    String type = cat.isIndoor() ? "Indoor" : "Outdoor";
                    return pet.getName() + " (" + type + " Cat): Expert climber and mouse hunter";
                } else if (pet instanceof Bird) {
                    Bird bird = (Bird) pet;  // Cast to Bird to access wingSpan
                    return pet.getName() + " (Bird): Can fly up to " + bird.getWingSpan() + " meters high";
                } else {
                    return pet.getName() + ": Has basic animal abilities";
                }
            }
        }
        return "Pet named '" + petName + "' not found.";
    }
    
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
            System.out.println(getPetSound(pets[i].getName()));
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
        
        // You can also create a generic Animal now (but it's not very useful)
        Animal genericAnimal = new Animal("Unknown", 0, "Gray");
        
        // Polymorphism: adding different types as Animal
        shelter.addPet(dog1);
        shelter.addPet(dog2);
        shelter.addPet(cat1);
        shelter.addPet(cat2);
        shelter.addPet(bird1);
        shelter.addPet(genericAnimal);  // This is now allowed!
        
        System.out.println("Pets added successfully!");
        System.out.println("Current capacity: " + shelter.getPetCount() + "/" + shelter.getMaxPets());
        System.out.println("Remaining slots: " + shelter.getRemainingCapacity() + "\n");
        
        // Display all pets
        System.out.println("=== All Pets in Shelter ===\n");
        
        Animal[] allPets = shelter.getAllPets();
        for (Animal pet : allPets) {
            System.out.println("Name: " + pet.getInfo());
            System.out.println("Sound: " + pet.makeSound());  // Polymorphism!
            System.out.println("Special Ability: " + pet.getSpecialAbility());
            System.out.println("Type: " + pet.getClass().getSimpleName());
            System.out.println("---");
        }
        
        System.out.println("\nAll pets making sounds:");
        System.out.println(shelter.makeAllPetsSound());
        
        // Demonstrating polymorphism with method calls
        System.out.println("\nDemonstrating Polymorphism:");
        Animal myPet;
        
        myPet = new Dog("Rocky", 2, "Brown", "Bulldog");
        System.out.println(myPet.getName() + " says: " + myPet.makeSound());
        
        myPet = new Cat("Fluffy", 3, "Orange", true);
        System.out.println(myPet.getName() + " says: " + myPet.makeSound());
        
        myPet = new Bird("Polly", 1, "Green", 20.0);
        System.out.println(myPet.getName() + " says: " + myPet.makeSound());
    }
}