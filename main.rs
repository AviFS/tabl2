use std::io;
use std::io::Read;
use std::io::Write;
use std::io::ErrorKind;

use std::fs::File;

use std::process::{Command, Stdio};

use std::{thread, time};
use std::sync::mpsc;
use std::sync::{Mutex, Arc};

use std::ffi::OsString;

enum ArrayStringStatus {
    First,
    ByteCount,
    Data
}

#[derive(PartialEq)]

enum IOKind {
    Stdout,
    Stderr
}

struct IOData {
    kind: IOKind,
    data: u8
}

fn array_string(str: Vec<u8>) -> Vec<Vec<u8>> {
    let mut array: Vec<Vec<u8>> = Vec::new();
    
    let mut i: usize = 0;
    
    while i < str.len() {
        let c_count = str[i];
        let mut b_count: usize = 0;
        
        i += 1;
        
        for _ in 0..c_count {
            b_count = b_count.checked_mul(256).unwrap().checked_add(usize::from(str[i])).unwrap();
            
            i += 1;
        }
        
        let mut data = vec![0u8; b_count];
        
        for k in 0..b_count {
            data[k] = str[i];
            
            i += 1;
        }
        
        array.push(data);
    }
    
    return array;
}

fn args_array(str: &Vec<u8>) -> Vec<OsString> {
    let array = array_string(str.to_vec());
    let mut args: Vec<OsString> = vec![];
    
    for a in array {
        args.push(OsString::from(std::str::from_utf8(&*a).unwrap()));
    }
    
    return args;
}

fn byte_count(str: Vec<u8>) -> Vec<u8> {
    let mut count: Vec<u8> = Vec::new();
    let mut n = str.len();
    let mut nb = 0u8;
    
    while n != 0 {
        count.push(n as u8);
        n /= 256;
        
        nb += 1;
    }
    
    count.reverse();
    
    return [vec![nb], count, str].concat();
}

fn main() {
    let mut data: Vec<u8> = Vec::new();
    let mut buf = [0u8; 1];
    
    let mut status = ArrayStringStatus::First;
    
    let mut c_count: u8 = 0;
    let mut b_count: usize = 0;
    let mut b_indx: usize = 0;
    
    loop {
        io::stdin().read_exact(&mut buf).unwrap();
        
        match status {
            ArrayStringStatus::First => {
                status = ArrayStringStatus::ByteCount;
                
                c_count = buf[0];
            }
            ArrayStringStatus::ByteCount => {
                b_count = b_count.checked_mul(256).unwrap().checked_add(usize::from(buf[0])).unwrap();
                
                c_count -= 1;
                
                if c_count == 0 {
                    status = ArrayStringStatus::Data;
                    
                    data = vec![0u8; b_count];
                }
            }
            ArrayStringStatus::Data => {
                data[b_indx] = buf[0];
                
                b_indx += 1;
                
                if b_indx == b_count {
                    break;
                }
            }
        }
    }
    
    let input = array_string(data);
    
    let mut file = File::create("main.?").unwrap();
    
    file.write_all(&*input[0]).unwrap();
    
    /*
    
    let mut compiler = Command::new("??").args(args_array(&input[3])).arg("-o").arg("main").arg("main.c").spawn().unwrap();

    compiler.wait().unwrap();
    
    let mut child = Command::new("./main").args(args_array(&input[2])).stdin(Stdio::piped()).stdout(Stdio::piped()).stderr(Stdio::piped()).spawn().unwrap();
    
    */
    
    
    let mut child = Command::new("??").args(args_array(&input[2])).arg("main,?").args(args_array(&input[2])).stdin(Stdio::piped()).stdout(Stdio::piped()).stderr(Stdio::piped()).spawn().unwrap();
    
    let mut c_stdin = child.stdin.take().unwrap();
    
    c_stdin.write_all(&*input[1]).unwrap();
    
    drop(c_stdin);

    let c_so_arc = Arc::new(Mutex::new(child.stdout.take().unwrap()));
    let c_sb_arc = Arc::new(Mutex::new(child.stderr.take().unwrap()));

    let t_so;
    let t_sb;
    let t_buf;
    
    let (tx_so, rx) = mpsc::channel();
    let tx_sb = tx_so.clone();

    t_so = thread::spawn(move || {
        let c_stdout = Arc::clone(&c_so_arc);
        let mut buf = [0u8; 1];

        loop {
            match c_stdout.lock().unwrap().read_exact(&mut buf) {
                Ok(()) => {
                    tx_so.send(IOData {
                        kind: IOKind::Stdout,
                        data: buf[0]
                    }).unwrap();
                }
                Err(info) => {
                    match info.kind() {
                        ErrorKind::UnexpectedEof => {
                            break;
                        }
                        _ => panic!("{}", info)
                    }
                }
            }
        }
    });

    t_sb = thread::spawn(move || {
        let c_stderr = Arc::clone(&c_sb_arc);
        let mut buf = [0u8; 1];

        loop {
            match c_stderr.lock().unwrap().read_exact(&mut buf) {
                Ok(()) => {
                    tx_sb.send(IOData {
                        kind: IOKind::Stderr,
                        data: buf[0]
                    }).unwrap();
                }
                Err(info) => {
                    match info.kind() {
                        ErrorKind::UnexpectedEof => {
                            break;
                        }
                        _ => panic!("{}", info)
                    }
                }
            }
        }
    });
    
    t_buf = thread::spawn(move || {
        loop {
            let mut buf: Vec<u8> = Vec::new();
            let mut top;
            
            match rx.recv() {
                Ok(x) => {
                    top = x
                }
                Err(_) => break
            }
            
            buf.push(top.data);
            
            thread::sleep(time::Duration::from_millis(10));
            
            loop {
                match rx.try_recv() {
                    Ok(x) => {
                        if x.kind == top.kind {
                            buf.push(x.data);
                        } else {
                            let mut out: Vec<u8> = match top.kind {
                                IOKind::Stdout => vec![0x01, 0x06, 0x73, 0x74, 0x64, 0x6f, 0x75, 0x74],
                                IOKind::Stderr => vec![0x01, 0x06, 0x73, 0x74, 0x64, 0x65, 0x72, 0x72]
                            };

                            out.append(&mut buf);

                            io::stdout().write_all(&*byte_count(out)).unwrap();
                            io::stdout().flush().unwrap();
                            
                            buf.clear();
                            
                            top = x;
                            
                            buf.push(top.data);
                        }
                    },
                    Err(_) => break
                }
            }
                
            if !buf.is_empty() {
                let mut out: Vec<u8> = match top.kind {
                    IOKind::Stdout => vec![0x01, 0x06, 0x73, 0x74, 0x64, 0x6f, 0x75, 0x74],
                    IOKind::Stderr => vec![0x01, 0x06, 0x73, 0x74, 0x64, 0x65, 0x72, 0x72]
                };
                
                out.append(&mut buf);
                
                io::stdout().write_all(&*byte_count(out)).unwrap();
                io::stdout().flush().unwrap();

                buf.clear();
            }
        }
    });

    t_so.join().unwrap();
    t_sb.join().unwrap();
    t_buf.join().unwrap();

    child.wait().unwrap();
}