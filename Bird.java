// Bird class extending Animal
public class Bird extends Animal {
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