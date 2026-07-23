# Herencia y polimorfismo

Dart permite crear jerarquías de clases usando herencia y polimorfismo. Puedes definir clases abstractas para establecer contratos que otras clases deben implementar.

## Herencia básica

```dart trycode=4869e28df4f8a68e8c078114a9ac4daa
class Animal {
  void makeSound() {
    print('Generic sound');
  }
}

class Dog extends Animal {
  @override
  void makeSound() {
    print('Woof!');
  }
}

void main() {
  var dog = Dog();
  dog.makeSound(); // Woof!
}
```

La herencia permite que una clase derive de otra y sobreescriba sus métodos.

## Clases abstractas y métodos abstractos

```dart trycode=a7c6ec93deee1c700cac841ac9f82e19
abstract class Shape {
  double area();
}

class Circle extends Shape {
  final double radius;
  Circle(this.radius);

  @override
  double area() => 3.14 * radius * radius;
}

void main() {
  Shape shape = Circle(2);
  print(shape.area()); // 12.56
}
```

Una clase abstracta puede definir métodos sin implementación. Las clases que la extienden deben implementar esos métodos.

## Polimorfismo

```dart trycode=7000c65bf56e4b4690cdcbb567a70d0b
void printArea(Shape shape) {
  print('Area:  {shape.area()}');
}

void main() {
  var circle = Circle(3);
  printArea(circle); // Area: 28.26
}
```

El polimorfismo permite usar una referencia de tipo abstracto para trabajar con cualquier clase que lo implemente.
