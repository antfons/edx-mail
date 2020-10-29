

# Edx Books Search 

![Backend lang](https://img.shields.io/badge/python-3.6-green)



[Brief video on Youtube](https://www.youtube.com/watch?v=MOAbCYLDWY8&t=26s "video")

#### Description
This project aims to design a front-end email like website where users are able to make send emails, reply emails, archived emails and view emails from other users. This content is all rendering on front-end by fetching data from a django api while using the concept of single page application.


## Table of content

- [**Getting Started**](#getting-started)
- [Built With](#built-with)
- [License](#license)
- [Motivation](#motivation)

## Getting Started
You can run this application by cloning the repository and running it with python.

### Requirements
- Python
- pipenv
- set your engine database/credentials on mail/settings.py

### Example for a simple local sqlite
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}
```

### Install python dependencies
```console
pipenv shell
```

### Migrate models to database
```console
python manage.py makemigrations mail
python manage.py mail
```

### Running the django application

```console
python manage.py
```

### Features
- Send mail
- See your mailbox
- View an email
- Archive/Unarchive mails
- Reply emails

### Open the application on the browser, create your user and start using it.
http://localhost:8000/

## Built With

### [Django](https://www.djangoproject.com/ "Django")
A high-level Python Web framework.
### Python
### JavaScript
### HTML
### CSS
### [Bootstrap](https://getbootstrap.com/ "Bootstrap")

## License

This project is licensed under the [MIT License](https://github.com/antfons/edx-mail/blob/master/LICENSE)


## Motivation
I've made this project while learning web development with Python and JavaScript and it's part of EDX HarvardX CS50's Web Programming with Python and JavaScript. [Edx Web Programming](https://courses.edx.org/courses/course-v1:HarvardX+CS50W+Web/course/ "Edx Web Programming")
