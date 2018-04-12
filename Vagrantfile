Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/trusty64"

#                                              Edit this port here
#                                                       v
  config.vm.network :forwarded_port, guest: 3000, host:3000

  config.vm.provider :virtualbox do |v|
    v.customize ["modifyvm", :id, "--memory", 1024]
  end

  config.vm.provision :shell, path: "vagrantscript.sh"
end

	
