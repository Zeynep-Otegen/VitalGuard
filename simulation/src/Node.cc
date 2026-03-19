#include "Node.h"
#include <string.h>
#include <omnetpp.h>

using namespace omnetpp;



Define_Module(Node);

void Node::initialize()
{
    // Sadece 'bileklik' isimli cihaz ilk mesajı başlatsın
    if (strcmp("bileklik", getName()) == 0) {
        cMessage *msg = new cMessage("Acil_Durum_Sinyali");
        EV << "Bileklik: Acil durum sinyali gönderiliyor...\n";
        send(msg, "gate$o", 0);
    }
}

void Node::handleMessage(cMessage *msg)
{
    // Mesaj gelince ekranda baloncuk çıkar ve geri gönder
    bubble("Mesaj Alındı!");
    EV << getName() << ": Mesajı aldım, geri gönderiyorum.\n";
    send(msg, "gate$o", 0);
}




