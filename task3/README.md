# Лабораторная работа №3. Основы JS и DOM: Todo-list

Интерактивный список задач на чистом JavaScript, реализованный по принципу MVC (на функциях, без классов).

## Ссылки

- GitHub: https://github.com/Y0r1ichi/web-course-2026
- Сайт: https://y0r1ichi.github.io/web-course-2026/task3/

## Возможности

- Добавление задачи кнопкой «Добавить» или клавишей Enter
- Проверка на пустой ввод с предупреждением
- Отметка задачи как выполненной и удаление
- Счётчик «Всего: N, Осталось: M, Выполнено: K»
- Фильтры «Все», «Активные», «Завершённые» (остальные задачи скрываются, но не удаляются из данных)

## Архитектура (MVC)

Код разделён на три модуля (ES modules, подключаются через `import`/`export`):

- **`model.js`** — данные и логика: `createState`, `addTask`, `toggleTask`, `deleteTask`, `setFilter`, `getVisibleTasks`, `getStats`. Состояние `{ tasks, nextId, filter }` передаётся аргументом, к DOM модель не обращается.
- **`view.js`** — только DOM: `getElements`, `render`, `getInputValue`, `clearInput`, `showWarning`, `hideWarning`. Разметка задач создаётся через `document.createElement`.
- **`controller.js`** — точка входа, функция `init()`: создаёт состояние, подписывает обработчики через `addEventListener`, при каждом действии меняет модель и вызывает `render()`.

Задачи хранятся в массиве объектов `{ id, text, completed }`, у каждой уникальный `id`. Классы, IIFE, циклы `for`/`while` и `onclick` в HTML не используются, глобальных переменных нет. `localStorage` не используется.

> Модули не работают при открытии `index.html` двойным кликом (`file://`). Нужен локальный сервер (например, расширение Live Server в VS Code) или GitHub Pages.

## Файлы

- `index.html`
- `style.css`
- `model.js`
- `view.js`
- `controller.js`
