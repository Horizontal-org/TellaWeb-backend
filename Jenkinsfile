pipeline {
  environment {
    imagename = "gmarcos87/tellaweb-backend"
    registryCredential = '65174897-5c07-4754-a198-ed4727630055'
    dockerImage = ''
  }
  agent any
  stages {
    stage('Cloning Git') {
      steps {
        git([url: 'https://github.com/Horizontal-org/tellaweb-nestjs.git', branch: env.BRANCH_NAME, credentialsId: '65174897-5c07-4754-a198-ed4727630055'])
 
      }
    }
    stage('Building image') {
      steps{
        script {
          dockerImage = docker.build imagename
        }
      }
    }

    timeout(time: 2, unit: 'DAYS') {
        input(
            message: 'Do you want to deploy the image?',
            ok: 'Yes',
            parameters: [booleanParam(defaultValue: true, description: 'Choose what to do', name: 'Yes?')])
    }

    stage('Deploy Image') {
      steps{
        script {
          docker.withRegistry( '', registryCredential ) {
            dockerImage.push("$BUILD_NUMBER")
             dockerImage.push('latest')
          }
        }
      }
    }
    stage('Remove Unused docker image') {
      steps{
        sh "docker rmi $imagename:$BUILD_NUMBER"
         sh "docker rmi $imagename:latest"
 
      }
    }
  }
}