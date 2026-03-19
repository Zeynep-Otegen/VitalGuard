#ifndef __VITALGUARD_NODE_H_
#define __VITALGUARD_NODE_H_

#include <omnetpp.h>

using namespace omnetpp;

class Node : public cSimpleModule {
  protected:
    virtual void initialize() override;
    virtual void handleMessage(cMessage *msg) override;
};

#endif
