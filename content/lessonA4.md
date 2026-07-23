# Condicionales

Las estructuras de control te permiten tomar decisiones en tu código. En Dart, las principales son `if`, `else` y `switch`.

## Estructura if básica

```dart trycode=56fccc30e3b1cff9300b6df7b413f012
void main() {
  int age = 18;
  
  if (age >= 18) {
    print('You are an adult');
  }
  
  // if with else
  if (age >= 18) {
    print('You are an adult');
  } else {
    print('You are a minor');
  }
}
```

El `if` evalúa una condición y ejecuta el código si es verdadera.

El `else` ejecuta código alternativo cuando la condición es falsa.

## if-else if-else

```dart trycode=0b3b037f5ba9cb2d0dcc6143a32183f6
void main() {
  int grade = 85;
  
  if (grade >= 90) {
    print('Excellent');
  } else if (grade >= 80) {
    print('Very good');
  } else if (grade >= 70) {
    print('Good');
  } else if (grade >= 60) {
    print('Passed');
  } else {
    print('Failed');
  }
}
```

Usa `else if` para evaluar múltiples condiciones en orden. Solo se ejecuta el primer bloque cuya condición sea verdadera.

## Operadores lógicos

```dart trycode=2f601504e024daf02cca4f7fc7d37e48
void main() {
  int age = 25;
  bool hasLicense = true;
  
  // AND (&&)
  if (age >= 18 && hasLicense) {
    print('You can drive');
  }
  
  // OR (||)
  if (age < 18 || !hasLicense) {
    print('You cannot drive');
  }
  
  // NOT (!)
  if (!hasLicense) {
    print('You need to get a license');
  }
}
```

`&&` (AND): ambas condiciones deben ser verdaderas.

`||` (OR): al menos una condición debe ser verdadera.

`!` (NOT): invierte el valor booleano.

## Estructura switch

```dart trycode=ed8a90a9d9800d1aa15f421b3558450c
void main() {
  String day = 'Monday';
  
  switch (day) {
    case 'Monday':
      print('Start of the week');
      break;
    case 'Tuesday':
    case 'Wednesday':
    case 'Thursday':
      print('Workday');
      break;
    case 'Friday':
      print('Friday!');
      break;
    case 'Saturday':
    case 'Sunday':
      print('Weekend');
      break;
    default:
      print('Invalid day');
  }
}
```

El `switch` evalúa una variable contra múltiples valores.

Usa `break` para salir del switch después de cada caso.

El `default` se ejecuta si ningún caso coincide.

## Switch con expresiones (Dart 3.0+)

```dart trycode=de38d5d1ed991997ce2fef292fb3e57b
void main() {
  int number = 5;
  
  String result = switch (number) {
    1 => 'One',
    2 => 'Two',
    3 => 'Three',
    _ => 'Other number'
  };
  
  print(result); // Other number
}
```

El switch con expresiones es más conciso y devuelve un valor. El `_` es el caso por defecto en switch expressions.
