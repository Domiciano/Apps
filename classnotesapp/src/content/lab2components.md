# Componentes de UI con Flutter

## AppMusicListItem

```dart
import 'package:flutter/material.dart';

class AppMusicListItem extends StatelessWidget {
  final String imageUrl;
  final String title;
  final String subtitle;

  const AppMusicListItem({
    Key? key,
    this.imageUrl = "https://raw.githubusercontent.com/Domiciano/AppMoviles251/refs/heads/main/res/images/Lab2Cover.png",
    this.title = "Title",
    this.subtitle = "Subtitle",
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Row(
        children: [
          CircleAvatar(
            radius: 28,
            backgroundImage: NetworkImage(imageUrl),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  title,
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(color: Colors.white),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                Text(
                  subtitle,
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: Colors.white),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
```

## LabeledTextField

```dart
import 'package:flutter/material.dart';

class LabeledTextField extends StatelessWidget {
  final String label;
  final String hint;
  final String value;
  final ValueChanged<String> onValueChange;

  const LabeledTextField({
    Key? key,
    this.label = "Label",
    this.hint = "Hint",
    required this.value,
    required this.onValueChange,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: Theme.of(context).textTheme.bodyLarge?.copyWith(color: Colors.white),
          ),
          const SizedBox(height: 8),
          TextField(
            controller: TextEditingController(text: value),
            onChanged: onValueChange,
            decoration: InputDecoration(
              hintText: hint,
              hintStyle: Theme.of(context).textTheme.bodyMedium?.copyWith(color: Colors.grey),
              filled: true,
              fillColor: Colors.white.withOpacity(0.13),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8.0),
                borderSide: BorderSide.none,
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8.0),
                borderSide: BorderSide.none,
              ),
              cursorColor: Colors.white,
            ),
            style: const TextStyle(color: Colors.white),
          ),
        ],
      ),
    );
  }
}
```

## ProfileCard

```dart
import 'package:flutter/material.dart';

class ProfileCard extends StatelessWidget {
  final String imageUrl;
  final String name;
  final String username;

  const ProfileCard({
    Key? key,
    this.imageUrl = "https://raw.githubusercontent.com/Domiciano/AppMoviles251/refs/heads/main/res/images/Lab2Cover.png",
    this.name = "Name",
    this.username = "Username",
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        CircleAvatar(
          radius: 120,
          backgroundImage: NetworkImage(imageUrl),
        ),
        const SizedBox(height: 8),
        Text(
          name,
          style: Theme.of(context).textTheme.headlineSmall?.copyWith(color: Colors.white),
        ),
        const SizedBox(height: 4),
        Text(
          username,
          style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: Colors.grey),
        ),
      ],
    );
  }
}
```

## StatCard

```dart
import 'package:flutter/material.dart';

class StatCard extends StatelessWidget {
  final String number;
  final String label;

  const StatCard({
    Key? key,
    required this.number,
    required this.label,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text(
          number,
          style: const TextStyle(
            fontSize: 48,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          label,
          style: const TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.normal,
            color: Colors.grey,
          ),
        ),
      ],
    );
  }
}
```

## LabeledTextFieldWithButton

```dart
import 'package:flutter/material.dart';

class LabeledTextFieldWithButton extends StatelessWidget {
  final String label;
  final String hint;
  final String value;
  final ValueChanged<String> onValueChange;
  final VoidCallback onButtonClick;

  const LabeledTextFieldWithButton({
    Key? key,
    this.label = "Label",
    this.hint = "Hint",
    required this.value,
    required this.onValueChange,
    required this.onButtonClick,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 4.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: Theme.of(context).textTheme.bodyLarge?.copyWith(color: Colors.white),
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: TextEditingController(text: value),
                  onChanged: onValueChange,
                  decoration: InputDecoration(
                    hintText: hint,
                    hintStyle: Theme.of(context).textTheme.bodyMedium?.copyWith(color: Colors.grey),
                    filled: true,
                    fillColor: Colors.white.withOpacity(0.13),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8.0),
                      borderSide: BorderSide.none,
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8.0),
                      borderSide: BorderSide.none,
                    ),
                    cursorColor: Colors.white,
                  ),
                  style: const TextStyle(color: Colors.white),
                ),
              ),
              const SizedBox(width: 8),
              IconButton(
                icon: const Icon(Icons.refresh, color: Colors.white),
                onPressed: onButtonClick,
                iconSize: 32,
              ),
            ],
          ),
        ],
      ),
    );
  }
}
```

## TitleWithBackground

```dart
import 'package:flutter/material.dart';

class TitleWithBackground extends StatelessWidget {
  final String imageUrl;
  final String title;
  final String subtitle;

  const TitleWithBackground({
    Key? key,
    required this.imageUrl,
    required this.title,
    required this.subtitle,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: const BorderRadius.vertical(bottom: Radius.circular(16.0)),
      child: Container(
        height: 250,
        width: double.infinity,
        decoration: BoxDecoration(
          image: DecorationImage(
            image: NetworkImage(imageUrl),
            fit: BoxFit.cover,
          ),
        ),
        child: Stack(
          children: [
            Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [Colors.black.withOpacity(0.7), Colors.transparent],
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: Theme.of(context).textTheme.headlineMedium?.copyWith(color: Colors.white),
                  ),
                  Text(
                    subtitle,
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: Colors.white),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
```

## AppBottomNavigationBar

```dart
import 'package:flutter/material.dart';

class AppBottomNavigationBar extends StatelessWidget {
  final int selectedItem;
  final Function(int) onOptionClick;

  const AppBottomNavigationBar({
    Key? key,
    this.selectedItem = 1,
    required this.onOptionClick,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return BottomNavigationBar(
      currentIndex: selectedItem,
      onTap: onOptionClick,
      backgroundColor: Colors.transparent,
      elevation: 0,
      selectedItemColor: Colors.white,
      unselectedItemColor: const Color(0xFF3A434F),
      selectedLabelStyle: const TextStyle(color: Colors.white),
      unselectedLabelStyle: const TextStyle(color: Color(0xFF3A434F)),
      items: const [
        BottomNavigationBarItem(
          icon: Icon(Icons.person_outline),
          label: 'Profile',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.menu_outlined),
          label: 'Playlists',
        ),
      ],
    );
  }
}
```

## AppFloatingButton

```dart
import 'package:flutter/material.dart';

class AppFloatingButton extends StatelessWidget {
  final VoidCallback onClick;

  const AppFloatingButton({
    Key? key,
    required this.onClick,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return FloatingActionButton.extended(
      onPressed: onClick,
      backgroundColor: const Color(0xFF1ED760),
      icon: const Icon(Icons.add, color: Colors.black),
      label: const Text(
        'Crear',
        style: TextStyle(color: Colors.black, fontSize: 16),
      ),
    );
  }
}
```

.
