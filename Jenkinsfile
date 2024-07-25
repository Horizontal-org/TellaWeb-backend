import groovy.json.JsonSlurperClassic

pipeline {
    agent any
    
    stages {
      stage ('check docker image tag') {
        steps {
          script {


            def tags = sh(script: 'curl "https://hub.docker.com/v2/namespaces/horizontalorg/repositories/tellaweb-api/tags?page_size=1&page=1"', returnStdout: true)

            def tags_parsed = new JsonSlurperClassic().parseText(json)
            echo tags_parsed

            tag = tags_parsed.results[0].name
            echo "TAG:"
            echo tag


            // deploy dev 
            if (tag ==~ /^beta-([0-9.]+)$/) {
              echo "deploy dev"
            }          

            // deploy prod
            if (tag ==~   /^[0-9.]+$/	) {
              echo "deploy prod"
            }
          }
        }
      }
      // stage ('Push docker image') {
      //   steps {
      //     script {
      //       echo "Pushing the image to docker hub"
      //       def localImage = "tellaweb-api:latest"
          
      //       def repositoryName = "horizontalorg/${localImage}"
          
      //       // Create a tag that going to push into DockerHub
      //       // sh "docker tag ${localImage} ${repositoryName} "
            
      //       docker.withRegistry("", "DockerHubCredentials") {
      //         def image = docker.image("${repositoryName}");
      //         image.push()
      //       }

      //     }
      //   }
      // }

      // stage ('Deploy to staging') {
      //   steps {
      //     script {
      //       sh '''            
      //         ssh -o StrictHostKeyChecking=no root@beta.web.tella-app.org "cd /home/tellaweb-beta ; docker-compose pull api ; docker-compose up -d api"
      //       '''
      //     }
      //   }
      // }

      // stage ('Clean unneccesary docker images') {
      //   steps{
      //       sh 'docker image prune -a -f'
      //   }
      // }
    }
}