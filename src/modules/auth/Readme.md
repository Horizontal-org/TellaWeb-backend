## Authorization Module

This module solves the problem of basic authorization headers

- Read and parse authorization headers
- Check if the credentials are valid for the user

### Current implementation

This module consumes the password verification that the user module exports. It makes use of the authorization libraries provided by nest and passport.

The **LoggedUser** decorator allows to extract the user infromation from the request.

```ts
@AuthController()
class SomeExample {
  @Get()
  getData(@LoggedUser() user: ReadUserDto) {
    console.log(user.username);
  }
}
```
