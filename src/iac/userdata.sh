#!/bin/bash
sudo apt update -y
sudo apt install -y mysql-server nodejs git

mkdir -p /home/projeto-pi
cd /home/projeto-pi
git clone https://github.com/IntelVision-PI/intelvision

useradd -m sysadmin
echo "sysadmin:sysadmin" | chpasswd
chown -R sysadmin:sysadmin /home/projeto-pi
