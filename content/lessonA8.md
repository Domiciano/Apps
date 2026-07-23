# Clases y objetos en Dart

Las clases son plantillas para crear objetos. En Dart, todo es un objeto, y las clases te permiten definir propiedades y comportamientos.

## Crear una clase básica

```dart trycode=e930ec503d90ef658887d57ace23df94
void main() {
  // Create an instance of the class
  Person person1 = Person('Ana', 25);
  person1.greet();
  
  Person person2 = Person('Carlos', 30);
  person2.greet();
}

class Person {
  String name;
  int age;
  
  // Constructor
  Person(this.name, this.age);
  
  // Method
  void greet() {
    print('Hi, I am $name and I am $age years old');
  }
}
```

Las clases definen propiedades (variables) y métodos (funciones). El constructor `Persona(this.nombre, this.edad)` inicializa las propiedades.

## Getters y setters

```dart trycode=bc1e77ba3975bc12df21b88f17af0ac3
void main() {
  Product product = Product('Laptop', 1200.0);
  
  print(product.name); // Laptop
  print(product.price); // 1200.0
  print(product.priceWithVAT); // 1428.0
  
  product.price = 1000.0; // Use setter
  print(product.priceWithVAT); // 1190.0
}

class Product {
  String name;
  double _price; // Private property
  
  Product(this.name, this._price);
  
  // Getter
  double get price => _price;
  double get priceWithVAT => _price * 1.19;
  
  // Setter
  set price(double value) {
    if (value > 0) {
      _price = value;
    }
  }
}
```

Los getters permiten acceder a propiedades calculadas. Los setters permiten validar datos antes de asignarlos. Las propiedades privadas empiezan con `_`.

## Herencia

```dart trycode=20a0a0bdf3a2f03a8aa519536fe40af2
void main() {
  Student student = Student('María', 20, 'Engineering');
  student.greet();
  student.study();
  
  Teacher teacher = Teacher('Dr. García', 45, 'Mathematics');
  teacher.greet();
  teacher.teach();
}

class Person {
  String name;
  int age;
  
  Person(this.name, this.age);
  
  void greet() {
    print('Hi, I am $name');
  }
}

class Student extends Person {
  String major;
  
  Student(String name, int age, this.major) : super(name, age);
  
  void study() {
    print('$name is studying $major');
  }
}

class Teacher extends Person {
  String subject;
  
  Teacher(String name, int age, this.subject) : super(name, age);
  
  void teach() {
    print('$name teaches $subject');
  }
}
```

- `extends` permite heredar de otra clase.
- `super()` llama al constructor de la clase padre.

Cada clase puede tener métodos específicos.

## Constructores nombrados

```dart trycode=85b89338cd1dec1644ef3814e11d0525
void main() {
  // Default constructor
  Vehicle car1 = Vehicle('Toyota', 'Corolla');
  
  // Named constructor
  Vehicle car2 = Vehicle.electric('Tesla', 'Model 3');
  Vehicle car3 = Vehicle.used('Ford', 'Focus', 2018);
  
  car1.showInfo();
  car2.showInfo();
  car3.showInfo();
}

class Vehicle {
  String brand;
  String model;
  String? type;
  int? year;
  
  // Default constructor
  Vehicle(this.brand, this.model);
  
  // Named constructor for electric vehicles
  Vehicle.electric(this.brand, this.model) {
    type = 'Electric';
  }
  
  // Named constructor for used vehicles
  Vehicle.used(this.brand, this.model, this.year);
  
  void showInfo() {
    String info = '$brand $model';
    if (type != null) info += ' ($type)';
    if (year != null) info += ' - Year $year';
    print(info);
  }
}
```

Los constructores nombrados permiten diferentes formas de crear objetos. Son útiles para casos de uso específicos con diferentes parámetros.
