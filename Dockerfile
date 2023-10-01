# Use Miniconda3 as the base image
#FROM continuumio/miniconda3
#
## Set the working directory
#WORKDIR /app
#
## Copy current directory contents into the container at /app
#COPY . /app
#
## Update Conda and install packages from environment.yml
#RUN conda update conda -y
#RUN conda env create -f environment.yml
#RUN conda clean -a -y
#
## Make RUN commands use the new environment
#SHELL ["conda", "run", "-n", "myenv", "/bin/bash", "-c"]
#
## Define command to run the application
#CMD ["conda", "run", "-n", "myenv", "python", "app.py"]


FROM continuumio/miniconda3

WORKDIR /app

COPY . /app

# Create the environment
RUN conda env create -f environment.yml

# Get the path to the Conda environment
ENV CONDA_ENV_PATH /opt/conda/envs/TTYD_docker

# Add the Conda environment to PATH
ENV PATH $CONDA_ENV_PATH/bin:$PATH

# Copy the content from 'my_app' directory (on your machine) to '/app' directory (inside the container)
COPY nsql-llama-2-7B/ /app/

SHELL ["conda", "run", "-n", "TTYD_docker", "/bin/bash", "-c"]

CMD ["conda", "run", "-n", "TTYD_docker", "python", "app.py"]
