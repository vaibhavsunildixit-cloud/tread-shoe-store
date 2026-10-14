pipeline {
    agent any

    environment {
        DOCKERHUB_CREDS = credentials('dockerhub-creds')
        IMAGE_NAME      = "${DOCKERHUB_CREDS_USR}/tread-shoe-store"
        IMAGE_TAG       = "v${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build and Test') {
            steps {
                echo 'Syntax-checking JavaScript files...'
                sh 'for f in js/*.js; do node --check "$f" && echo "OK: $f"; done'
                echo 'Checking required files exist...'
                sh 'test -f index.html && test -f css/style.css && echo "Static site files found"'
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker build -t $IMAGE_NAME:$IMAGE_TAG -t $IMAGE_NAME:latest .'
            }
        }

        stage('Push Image') {
            steps {
                sh 'echo $DOCKERHUB_CREDS_PSW | docker login -u $DOCKERHUB_CREDS_USR --password-stdin'
                sh 'docker push $IMAGE_NAME:$IMAGE_TAG'
                sh 'docker push $IMAGE_NAME:latest'
            }
        }

        stage('Minikube Deployment') {
            steps {
                sh 'sed -i "s|IMAGE_PLACEHOLDER|$IMAGE_NAME:$IMAGE_TAG|" k8s/deployment.yaml'
                sh 'kubectl apply -f k8s/deployment.yaml'
                sh 'kubectl apply -f k8s/service.yaml'
                sh 'kubectl rollout status deployment/tread-deployment --timeout=120s'
            }
        }

        stage('Verification') {
            steps {
                sh 'kubectl get pods -o wide'
                sh 'kubectl get deployment tread-deployment'
                sh 'kubectl get service tread-service'
                sh 'curl -s http://$(minikube ip):30080 | grep -i "<title>"'
            }
        }
    }

    post {
        always {
            sh 'docker logout || true'
        }
        success {
            echo "Deployed ${IMAGE_NAME}:${IMAGE_TAG} successfully"
        }
        failure {
            echo 'Pipeline failed - check the stage logs above'
        }
    }
}
