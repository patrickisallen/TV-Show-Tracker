Vagrant::DEFAULT_SERVER_URL.replace('https://vagrantcloud.com')
Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/trusty64"

#                                              Edit this port here
#                                                       v
  config.vm.network :forwarded_port, guest: 3000, host:8260


  config.vm.provision :shell, path: "vagrantscript.sh"
end
