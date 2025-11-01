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
    
    public String getName() { 
        return name; 
    }
    
    public int getAge() { 
        return age; 
    }
    
    public String getColor() { 
        return color; 
    }
}