# Set nginx base image
FROM nginx

# Needed librairies
RUN apt-get update -y && \
    apt-get -y install python-pip && \
    apt-get install git -y && \
    apt-get clean all

# Copy custom configuration file from the current directory
COPY nginx.conf /etc/nginx/nginx.conf

# Append "daemon off;" to the beginning of the configuration
# in order to avoid an exit of the container
RUN echo "daemon off;" >> /etc/nginx/nginx.conf

WORKDIR /www

RUN cd /www && \
    git clone https://github.com/irrelon/ige

# Expose ports
EXPOSE 80

# Define default command
CMD service nginx start