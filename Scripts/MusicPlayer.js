StaticClass = Java.type("jdk.internal.dynalink.beans.StaticClass");
FileOutputStream = Java.type("java.io.FileOutputStream");
FileInputStream = Java.type("java.io.FileInputStream");
URLClassLoader = Java.type("java.net.URLClassLoader");
Channels = Java.type("java.nio.channels.Channels");
Runnable = Java.type("java.lang.Runnable");
Desktop = Java.type("java.awt.Desktop");
Thread = Java.type("java.lang.Thread");
Class = Java.type("java.lang.Class");
Long = Java.type("java.lang.Long");
File = Java.type("java.io.File");
URL = Java.type("java.net.URL");

command = {
    commands: ["MusicPlayer", "mp"],
    subcommands: ["play", "stop", "list", "folder"],
    author: "natte",
    version: 1.1,
    onExecute: function (args) {
        try {
            setup();
            folder = new File("LiquidBounce-1.8/music/");

            switch(args[1]) {
                case "play": {
                    if (args.length <= 2) {
                        chat.print("§8▏ §7Usage§8: §f" + prefix + Java.from(args).join(" ") + " §8[§fname§8/§furl§8]");
                        return;
                    }

                    if (thread != null) {
                        chat.print("§8▏ §cPlayer is already playing");
                        return;
                    }

                    name = "";

                    if ((args[2].startsWith("https") || args[2].startsWith("http")) && args[2].endsWith(".mp3")) {
                        player = new Player(new URL(args[2]).openStream());
                        name = args[2];
                    } else {
                        file = new File(folder, args[2].endsWith(".mp3") ? args[2] : args[2] + ".mp3");

                        if (!file.exists()) {
                            chat.print("§8▏ §cCouldn't find '§4§l" + file.getName() + "§c'");
                            return;
                        }

                        player = new Player(new FileInputStream(file));
                        name = file.getName();
                    }

                    if (player == null) {
                        chat.print("§8▏ §cerror");
                        return;
                    }

                    thread = new Thread(new Runnable({
                        run: function () {
                            player.play();
                        }
                    }));
                    thread.start();

                    chat.print("§8▏ §aPlaying '§2§l" + name + "§a'");
                    break;
                }

                case "stop": {
                    if (thread != null) {
                        thread.stop();
                        thread = null;
                        chat.print("§8▏ §cPlayer stopped");
                    } else chat.print("§8▏ §cPlayer is not playing");
                    break;
                }

                case "list": {
                    files = folder.listFiles();
                    array = [];

                    for (i = 0; i < files.length; i++) {
                        file = files[i]; name = file.getName();

                        if (name.endsWith(".mp3")) array.push(name);
                    }

                    chat.print("§8▏ §7Local songs: §8(§7" + array.length + "§8)");
                    for (i in array) chat.print("§8▏ §8[§7" + (parseInt(i) + 1) + "§8]§7 " + array[i]);
                    break;
                }

                case "folder": {
                    Desktop.getDesktop().open(folder);
                    chat.print("§8▏ §aOpened folder");
                    break;
                }
            }
        } catch(e) {
            chat.print(e);
        }
    },
    onLoad: function () {
        setup();
    },
    onUnload: function () {
        if (thread != null) {
            thread.stop();
            thread = null;
        }
    }
}

function setup() {
    if (!new File("LiquidBounce-1.8/music/").exists()) {
        new File("LiquidBounce-1.8/music/").mkdir();
    }

    if (!new File("LiquidBounce-1.8/music-api.jar").exists()) {
        chat.print("§8▏ §aDownloading api...");
        connection = new URL("https://natte.dev/mp/music-api.jar").openConnection();

        connection.setRequestProperty("User-Agent", "Mozilla/5.0");
        channel = Channels.newChannel(connection.getInputStream());
        output = new FileOutputStream(new File("LiquidBounce-1.8/music-api.jar"));
        
        output.getChannel().transferFrom(channel, 0, Long.MAX_VALUE);
        output.close();
        chat.print("§8▏ §aapi downloaded");

        Player = classLoader.type("javazoom.jl.player.Player");
    }
}

function ClassLoader() {
    this._convertArguments = function(args) {
        return [].slice.call(args).map(function(path) {
            return new URL("jar:file:" + path + "!/")
        });
    }

    this.type = function (className) {
        var clazz = Class.forName(className, true, this.classLoader);
        return StaticClass.forClass(clazz);
    }

    this.classLoader = new URLClassLoader(this._convertArguments(arguments));
}

script.import("Core.lib"); classLoader = new ClassLoader("LiquidBounce-1.8/music-api.jar"); Player = null; if (new File("LiquidBounce-1.8/music-api.jar").exists()) Player = classLoader.type("javazoom.jl.player.Player"); player = null; thread = null; folder = null;
