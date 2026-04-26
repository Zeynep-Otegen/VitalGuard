//
// Copyright (C) 2006 OpenSim Ltd.
//
// SPDX-License-Identifier: LGPL-3.0-or-later
//

package obstacle;


import inet.environment.common.PhysicalEnvironment;
import inet.networklayer.configurator.ipv4.Ipv4NetworkConfigurator;
import inet.node.inet.AdhocHost;
import inet.node.inet.StandardHost;
// WiFi medyasını siliyoruz, yerine bunu ekliyoruz:
import inet.physicallayer.wireless.common.medium.RadioMedium;
// 802.15.4 arayüzünü ekliyoruz:
import inet.linklayer.ieee802154.Ieee802154NarrowbandInterface;
import inet.visualizer.contract.IIntegratedVisualizer;
import inet.visualizer.contract.IIntegratedVisualizer;

network HospitalNet
{
    parameters:
        int numHosts;
        int numMonitors;
        @display("bgb=1200,1000");
    submodules:
        visualizer: <default("IntegratedCanvasVisualizer")> like IIntegratedVisualizer if typename != "" {
            parameters:
                @display("p=96,928;is=s");
        }
        physicalEnvironment: PhysicalEnvironment {
            parameters:
                @display("p=299,930;is=s");
        }
        configurator: Ipv4NetworkConfigurator {
            parameters:
                @display("p=414,930;is=s");
        }
        radioMedium: RadioMedium {
            parameters:
                @display("p=189,928;is=s");
        }
        host[numHosts]: AdhocHost {
            parameters:
                @display("i=misc/person4");
        }
        monitor[numMonitors]: AdhocHost { // standardHost yerine AdhocHost daha iyidir (kablosuz özellikler için)
            parameters:
                @display("i=device/server_s"); // Monitör ikonu
        }
}
