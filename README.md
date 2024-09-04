# To prepare release 

### For development

- write package.json "version" with the number needed for production (without 'beta-' prefix in any case)
- close pr's and merge them to development
- push tag from development with the version number and the prefix, example: 'beta-1.2.3'. This will start the build of the image in dockerhub
- After the build pull the new images on the beta server and run migrations if necessary

### For deploying production
- merge what needs merging from development
- push tag without any prefix, example: '1.2.3', this will start the build of the image in dockerhub
- After the build pull the new images on the production server/s and run migrations if necessary
