// VitalGuard Projesi İlk Test Ağı
network VitalGuardNet
{
    @display("bgb=444,285");
    submodules:
        bileklik: Node {
            @display("p=86,134;i=device/pocketpc");
        }
        gateway: Node {
            @display("p=338,134;i=device/antennatower");
        }
    connections:
        bileklik.gate++ <--> {  delay = 100ms; } <--> gateway.gate++;
}

// Basit bir düğüm tanımı
simple Node
{
    gates:
        inout gate[];
}
