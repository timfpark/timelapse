# Sunset 

Nitrogen application that automatically takes photos around sunset given a location and a camera id.

## Using this application

1. Nitrogen applications are executed in a reactor.  Check out our [project page](http://nitrogen.io) for an walkthrough of Nitrogen if this is your first exposure to it.
2. Use the [Nitrogen command tool](http://github.com/nitrogenjs/cli) to install this application into a reactor:

`n2 reactor install <reactor_id> <instance_id> sunset`

3. Then start the application using:

`n2 reactor install <reactor_id> <instance_id> --params '{"camera_id": "ID", "latitude": 34.22, "longitude": -123.12}'`

## Paramters

* camera_id:  The camera to take a photo of the sunset with
* latitude: The latitude this camera is at (for calculation of the sunset time)
* longitude: The longitude this camera is at (for calculation of the sunset time)

## Other Projects

1. [service](https://github.com/nitrogenjs/service): The core Nitrogen service responsible for managing users, devices, and messaging between them.
2. [client](https://github.com/nitrogenjs/client): The client library for building Nitrogen devices and applications.
3. [admin](https://github.com/nitrogenjs/admin): An administrative tool for managing the Nitrogen service.