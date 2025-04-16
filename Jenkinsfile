pipeline {
    agent any

    environment {
        COMPOSE_FILE = 'docker-compose.yml'
    }

    stages {
        stage('Checkout Code') {
            steps {
                git url: 'https://github.com/klu-2200031955/Project.git', branch: 'main'
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    // Ensure the latest versions of Docker images are pulled
                    sh 'docker-compose pull'
                    sh 'docker-compose build'
                }
            }
        }

        stage('Deploy Services') {
            steps {
                script {
                    // Stop and remove any previous containers if they're running
                    sh 'docker-compose down --volumes --remove-orphans'
                    // Start up the services
                    sh 'docker-compose up -d'
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                script {
                    // List running containers to verify the deployment
                    sh 'docker ps'
                }
            }
        }
    }

    post {
        success {
            echo 'Deployment Successful!'
        }
        failure {
            echo 'Deployment Failed.'
        }
        always {
            // Clean up unused Docker images and containers
            sh 'docker system prune -af'
        }
    }
}
