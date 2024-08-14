import React, { useEffect, useState } from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { getAllCountry } from "../api/country";
import Logo from "../assets/pdflogo.jpg";
import body from "../assets/myanma_insurnace_8-images-0-b.jpg";
import qr from "../assets/qr.png";
import PAGE1 from "../assets/myanma_insurnace_8-images-1.jpg";
import PAGE2 from "../assets/myanma_insurnace_8-images-2.jpg";
import PAGE3 from "../assets/myanma_insurnace_8-images-3.jpg";
import PAGE4 from "../assets/myanma_insurnace_8-images-4.jpg";
import PAGE5 from "../assets/myanma_insurnace_8-images-5.jpg";
import PAGE6 from "../assets/myanma_insurnace_8-images-6.jpg";
import PAGE7 from "../assets/myanma_insurnace_8-images-7.jpg";
import PAGE8 from "../assets/myanma_insurnace_8-images-8.jpg";
import PAGE9 from "../assets/myanma_insurnace_8-images-9.jpg";
import PAGE10 from "../assets/myanma_insurnace_8-images-10.jpg";
import PAGE11 from "../assets/myanma_insurnace_8-images-11.jpg";
import { formatDate } from "../ultils/dateFormat";
import { formatCurrency } from "../ultils/formatCurrency";

const styles = StyleSheet.create({
  detailRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    margin: "5px 0",
  },
  label: {
    width: "40%",
    fontSize: 8,
    paddingRight: 10,
  },
  value: {
    width: "60%",
    fontSize: 8,
  },
  insuredPerson: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    marginLeft: 70,
  },
  imgcard: {
    marginLeft: 70,
    fontSize: 8,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  certificateTitle: {
    textAlign: "left",
    fontSize: 12,
    margin: "10px 0",
    marginLeft: 70,
  },
  detailContainer: {
    flex: 1,
  },
  table: {
    marginLeft: 70,
    marginRight: 20,
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    backgroundColor: "#e0f7fa",
  },
  tableCol: {
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCellHeader: {
    margin: 5,
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  tableCell: {
    margin: 5,
    fontSize: 10,
    textAlign: "center",
  },
  block: {
    display: "block",
    marginBottom: 2,
  },
  printdate: {
    display: "flex",
    fontSize: 8,
    flexDirection: "row",
    gap: 15,
    margin: "0 40px",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  qrImg: {
    width: 100,
    height: 100,
  },
});

const MyDocument = ({ item }) => {
  const [passportIssuedCountry, setPassportIssuedCountry] = useState("");
  const [destinationCountry, setDestinationCountry] = useState("");

  useEffect(() => {
    getCountries();
  }, []);

  const getCountries = async () => {
    try {
      let res = await getAllCountry();
      setPassportIssuedCountry(
        res.data.filter(
          (country) => country.id == item.passportIssuedCountry
        )[0]?.countryName
      );
      setDestinationCountry(
        res.data.filter((country) => country.id == item.destinationTo)[0]
          ?.countryName
      );
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <Document>
      <Page size="A4">
        <View>
          <View>
            <Image src={Logo} />
          </View>
          <View style={styles.insuredPerson}>
            <View style={styles.detailContainer}>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Insurance Period</Text>
                <Text style={styles.value}>
                  : {item.coveragePlan} Days ( From {item.policyStartDate} To
                  {item.policyEndDate})
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Certificate Number</Text>
                <Text style={styles.value}>: {item.certificateNumber}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Agent/Agent name</Text>
                <Text style={styles.value}>
                  : {item.agentName ? item.agentName : "[N/A]"}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Policy Holder</Text>
                <Text style={styles.value}>: {item.name}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Covid-19 coverage</Text>
                <Text style={styles.value}>: Yes</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Territorial Area</Text>
                <Text style={styles.value}>: Worldwide</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>
                  {item.forChild
                    ? "Buy for the child travel together with this passport holder(Child is not holding a valid passport)"
                    : "Buy for yourself(The passport Holder)"}
                </Text>
              </View>
            </View>
            <View style={styles.detailContainer}>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Benefits</Text>
                <Text style={styles.value}>: As per benefit table</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Destination To</Text>
                <Text style={styles.value}>: {destinationCountry}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>PP/Country</Text>
                <Text style={styles.value}>
                  : {item.passportNumber} {passportIssuedCountry}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Deductible/person</Text>
                <Text style={styles.value}>
                  : {formatCurrency(item.packages)}{" "}
                  {item.packages === 10000 ||
                  item.packages === 30000 ||
                  item.packages === 50000
                    ? "$"
                    : "Kyat"}{" "}
                  per claim *
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Currency</Text>
                <Text style={styles.value}>
                  :{" "}
                  {item.packages === 10000 ||
                  item.packages === 30000 ||
                  item.packages === 50000
                    ? "USD"
                    : "MMK"}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Payment Date</Text>
                <Text style={styles.value}>: {item.submittedDate}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Premium</Text>
                <Text style={styles.value}>: {item.rates}</Text>
              </View>
            </View>
          </View>
          <Text style={styles.certificateTitle}>
            This Certificate of Insurance confirms coverage for:
          </Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Insured's Name</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Date of Birth</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Age</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Insurance Period</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Passport No</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {item.forChild ? item.childName : item.name}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {item.forChild
                    ? formatDate(item.childDOB)
                    : formatDate(item.dob)}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.age}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.coveragePlan} Days</Text>
              </View>
              <View style={styles.tableCol}>
                <View style={styles.tableCell}>
                  {item.forChild ? (
                    <Text>Child without passport</Text>
                  ) : (
                    <>
                      <Text style={styles.block}>{item.passportNumber}</Text>
                      <Text style={styles.block}>{passportIssuedCountry}</Text>
                    </>
                  )}
                </View>
              </View>
            </View>
          </View>
          <View>
            <Image src={body} />
          </View>
          <View style={styles.imgcard}>
            <Image src={qr} style={styles.qrImg} />
            <View style={styles.printdate}>
              <Text>Print Date:</Text>
              <Text>{formatDate(item.submittedDate)}</Text>
            </View>
          </View>
        </View>
      </Page>
      {[
        PAGE1,
        PAGE2,
        PAGE3,
        PAGE4,
        PAGE5,
        PAGE6,
        PAGE7,
        PAGE8,
        PAGE9,
        PAGE10,
        PAGE11,
      ].map((page, index) => (
        <Page key={index} size="A4">
          <Image src={page} />
          <View style={styles.printdate}>
            <Text>Print Date:</Text>
            <Text>{formatDate(item.submittedDate)}</Text>
          </View>
        </Page>
      ))}
    </Document>
  );
};

export default MyDocument;
