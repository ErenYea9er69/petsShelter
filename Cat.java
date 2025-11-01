// Cat class extending Animal
public class Cat extends Animal {
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