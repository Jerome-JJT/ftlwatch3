
## Contribution 1 : Create a new issue

If you spot a bug with the website or have a feature idea, you can create an issue

## Contribution 2 : Do the change yourself

### Setup the project

- Fork the repository and pull your fork.
- Create a working branch and start with your changes!
- Duplicate the .env.example to .env, default values works well for testing, except if you want authentification
- For authentification, you can put a 42 api uid and secret in the API_FRONT_UID, API_FRONT_SECRET variables and put the content of the default CALLBACK_URL as redirect url for the api.
- Before starting everything, you will need the external network you can create with `make presetup`
- You can then execute `make` to build and start everything
- You then need to run `make setup` to create everything else in the project
- You may need to run `make` again then everything should start and the website available on loclahost:8080


### Send your modifications

- Don't forget to **self-review** and check if you didn't left some test files or push your .env 🙄.
- Remerge the current main on your version to minimize the risks of conflicts
- Create a pull request with an accurate description

### Your PR is merged and you are a contributor, thanks

