// Dog class extending Animal
public class Dog extends Animal {
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